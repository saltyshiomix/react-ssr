import fse from 'fs-extra';
import path from 'path';
import slash from 'slash';
import webpack from 'webpack';
import {
  ssrConfig,
  getEngine,
  getPages,
  getPageId,
} from '../helpers';

const cwd = process.cwd();
const ext = '.' + getEngine();

export const getEntry = async (memfs: any): Promise<[webpack.Entry, string[]]> => {
  const entry: webpack.Entry = {};
  const entryPages = await getPages();
  const entryPath = path.resolve(__dirname, `../../lib/webpack/${ssrConfig.id}.js`);
  let template = fse.readFileSync(entryPath).toString();

  let appPath = path.join(__dirname, 'app.js');
  if (fse.existsSync(path.join(cwd, ssrConfig.viewsDir, `_app${ext}`))) {
    appPath = path.join(cwd, ssrConfig.viewsDir, `_app${ext}`);
  }

  memfs.mkdirpSync(path.join(cwd, 'react-ssr-src'));

  for (let i = 0; i < entryPages.length; i++) {
    const page = entryPages[i];
    const pageId = getPageId(page, '/');
    const dir = path.dirname(pageId);
    const name = path.basename(pageId);
    if (dir !== '.') {
      memfs.mkdirpSync(path.join(cwd, 'react-ssr-src', dir));
    }
    memfs.writeFileSync(
      path.join(cwd, 'react-ssr-src', dir, `entry-${name}${ext}`),
      template
        .replace('__REACT_SSR_APP__', slash(appPath))
        .replace('__REACT_SSR_PAGE__', slash(page)),
    );
    entry[getPageId(page, '_')] = `./react-ssr-src/${slash(dir)}/entry-${name}${ext}`;
  }

  return [entry, entryPages];
};
