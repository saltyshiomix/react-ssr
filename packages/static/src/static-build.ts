import fs from 'fs-extra';
import path from 'path';
import got from 'got';
import express from 'express';
import register from './register';
import {
  getStaticConfig,
  sleep,
} from './helpers';

process.env.NODE_ENV = 'production';

const cwd = process.cwd();
const app = express();
const config = getStaticConfig();

(async () => {
  console.log('[react-ssr] Preparing...');

  const tmp = path.join(cwd, '.tmp');
  const dist = path.join(cwd, config.distDir);
  const routes = Object.keys(config.routes);

  fs.removeSync(tmp);
  fs.removeSync(dist);

  await register(app);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const view = config.routes[route];
    app.get(route, (_req: express.Request, res: express.Response) => {
      res.render(view);
    });
  }

  app.listen(config.port, async () => {
    try {
      for (let i = 0; i < routes.length; i++) {
        await got(`http://localhost:${config.port}${routes[i]}`);
      }

      await sleep(500);

      fs.moveSync(dist, tmp);

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const view = config.routes[route];

        const oldPageId = view.split('/').join('_');
        const _newPageId = route.indexOf('/') === 0 ? route.slice(1) : route;
        const newPageId = _newPageId === '' ? 'index' : _newPageId;
        const newBasename = path.basename(newPageId);

        const oldStylePath = path.join(tmp, `${oldPageId}.css`);
        const newStylePath = path.join(dist, `${newPageId}.css`);
        const hasStyle = fs.existsSync(oldStylePath);
        if (hasStyle) {
          fs.outputFileSync(newStylePath, fs.readFileSync(oldStylePath));
        }

        const oldScriptPath = path.join(tmp, `${oldPageId}.js`);
        const newScriptPath = path.join(dist, `${newPageId}.js`);
        fs.outputFileSync(newScriptPath, fs.readFileSync(oldScriptPath));

        const oldHtmlPath = path.join(tmp, `${oldPageId}.html`);
        const newHtmlPath = path.join(dist, `${newPageId}.html`);
        if (hasStyle) {
          fs.outputFileSync(
            newHtmlPath,
            fs.readFileSync(oldHtmlPath)
              .toString()
              .replace(`src="/_react-ssr/${oldPageId}.js"`, `src="./${newBasename}.js"`)
              .replace(`href="/_react-ssr/${oldPageId}.css"`, `href="./${newBasename}.css"`),
          );
        } else {
          fs.outputFileSync(
            newHtmlPath,
            fs.readFileSync(oldHtmlPath)
              .toString()
              .replace(`src="/_react-ssr/${oldPageId}.js"`, `src="./${newBasename}.js"`)
              .replace(`<link rel="stylesheet" href="/_react-ssr/${oldPageId}.css">`, ''),
          );
        }

        console.log(`[react-ssr] Created "${route}"`);
      }

      fs.removeSync(tmp);

      for (let i = 0; i < config.publicPaths.length; i++) {
        fs.copySync(path.join(cwd, config.publicPaths[i]), dist);
      }

      console.log(`[react-ssr] Generated static files in "${config.distDir}"`);

      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
