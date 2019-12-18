import fs from 'fs-extra';
import path from 'path';
import got from 'got';
import express from 'express';
import register from './register';
import {
  staticConfig,
  sleep,
} from './helpers';

process.env.NODE_ENV = 'production';

const cwd = process.cwd();
const app = express();

(async () => {
  console.log('[react-ssr] Preparing...');

  fs.removeSync(path.join(cwd, staticConfig.distDir));

  await register(app);

  const routes = Object.keys(staticConfig.routes);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const view = staticConfig.routes[route];
    app.get(route, (_req: express.Request, res: express.Response) => {
      res.render(view);
    });
  }

  app.listen(staticConfig.port, async () => {
    const tmpPath = path.join(cwd, 'tmp');

    try {
      for (let i = 0; i < routes.length; i++) {
        await got(`http://localhost:${staticConfig.port}${routes[i]}`);
      }

      // wait until static files are ready
      await sleep(500);

      fs.moveSync(path.join(cwd, staticConfig.distDir), tmpPath);

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const view = staticConfig.routes[route];

        const oldPageId = view.split('/').join('_');
        const _newPageId = route.indexOf('/') === 0 ? route.slice(1) : route;
        const newPageId = _newPageId === '' ? 'index' : _newPageId;
        const newBasename = path.basename(newPageId);

        const oldStylePath = path.join(cwd, `tmp/${oldPageId}.css`);
        const newStylePath = path.join(cwd, staticConfig.distDir, `${newPageId}.css`);
        const hasStyle = fs.existsSync(oldStylePath);
        if (hasStyle) {
          fs.outputFileSync(newStylePath, fs.readFileSync(oldStylePath));
        }

        const oldScriptPath = path.join(cwd, `tmp/${oldPageId}.js`);
        const newScriptPath = path.join(cwd, staticConfig.distDir, `${newPageId}.js`);
        fs.outputFileSync(newScriptPath, fs.readFileSync(oldScriptPath));

        const oldHtmlPath = path.join(cwd, `tmp/${oldPageId}.html`);
        const newHtmlPath = path.join(cwd, staticConfig.distDir, `${newPageId}.html`);
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

      fs.removeSync(tmpPath);

      for (let i = 0; i < staticConfig.publicPaths.length; i++) {
        const publicPath = staticConfig.publicPaths[i];
        fs.copySync(path.join(cwd, publicPath), path.join(cwd, staticConfig.distDir));
      }

      console.log(`[react-ssr] Generated static files in "${staticConfig.distDir}"`);

      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
