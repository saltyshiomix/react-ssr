import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import readdir from 'recursive-readdir';

const cwd: string = process.cwd();

export interface Config {
  id: string;
  viewsDir: string;
  distDir: string;
  webpack?: (defaultConfig: webpack.Configuration, env: 'development' | 'production') => webpack.Configuration;
}

export const getSsrConfig = (): Config => {
  const defaultConfig = {
    id: 'default',
    viewsDir: 'views',
    distDir: '.ssr',
  };
  const ssrConfigPath = path.join(cwd, 'ssr.config.js');
  if (fs.existsSync(ssrConfigPath)) {
    return Object.assign(defaultConfig, require(ssrConfigPath));
  } else {
    return defaultConfig;
  }
};

export const getEngine = (): 'jsx' | 'tsx' => fs.existsSync(path.join(cwd, 'tsconfig.json')) ? 'tsx' : 'jsx';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const config: Config = getSsrConfig();

export const getPages = async (): Promise<string[]> => {
  const possibles = await readdir(path.join(cwd, config.viewsDir));
  const pages = [];
  for (let i = 0; i < possibles.length; i++) {
    const possible = possibles[i];
    const name = path.basename(getPageId(possible, '/'));
    if (name.toLowerCase().startsWith('_document')) {
      continue;
    }
    pages.push(possible);
  }
  return pages;
};

export const getPageId = (page: string, separator: string = '_'): string => {
  const [, ...rest] = page.replace(path.join(cwd, config.viewsDir), '')
                          .replace(path.extname(page), '')
                          .split(path.sep);
  return rest.join(separator);
};

export const readFileWithProps = (file: string, props: any, memfs?: any) => {
  return (memfs || fs)
    .readFileSync(file).toString()
    .replace(
      '__REACT_SSR_PROPS__',
      JSON.stringify(props).replace(/"/g, '\\"'),
    );
};

const ignores = [
  '.*',
  '*.json',
  '*.lock',
  '*.md',
  '*.txt',
  '*.yml',
  'LICENSE',
];

const ignoreDotDir = (file: string, stats: fs.Stats) => {
  return stats.isDirectory() && path.basename(file).startsWith('.');
};

const ignoreNodeModules = (file: string, stats: fs.Stats) => {
  return stats.isDirectory() && path.basename(file) == 'node_modules';
};

export const getCacheablePages = async (): Promise<string[]> => {
  return readdir(cwd, [ignoreNodeModules, ignoreDotDir, ...ignores]);
};
