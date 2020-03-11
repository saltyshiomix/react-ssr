import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import readdir from 'recursive-readdir';

const cwd: string = process.cwd();

export interface StaticConfig {
  id: string;
  distDir: string;
  viewsDir: string;
  port: number;
  routes: { [key: string]: string };
  publicPaths: string[];
  webpack?: (defaultConfig: webpack.Configuration, env: 'development' | 'production') => webpack.Configuration;
}

export const getStaticConfig = (): StaticConfig => {
  const defaultConfig = {
    id: 'default',
    distDir: 'dist',
    viewsDir: 'views',
    port: 3000,
    routes: {},
    publicPaths: [],
  };
  const staticConfigPath = path.join(cwd, 'static.config.js');
  if (fs.existsSync(staticConfigPath)) {
    return Object.assign(defaultConfig, require(staticConfigPath));
  } else {
    return defaultConfig;
  }
};

const staticConfig = getStaticConfig();

export const getEngine = (): 'jsx' | 'tsx' => fs.existsSync(path.join(cwd, 'tsconfig.json')) ? 'tsx' : 'jsx';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPages = async (): Promise<string[]> => {
  const possibles = await readdir(path.join(cwd, staticConfig.viewsDir));
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
  const [, ...rest] = page.replace(path.join(cwd, staticConfig.viewsDir), '')
                          .replace(path.extname(page), '')
                          .split(path.sep);
  return rest.join(separator);
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
