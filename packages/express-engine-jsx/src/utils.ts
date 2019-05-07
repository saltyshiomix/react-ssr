import { sep } from 'path';
import { Config } from '@react-ssr/express';

const getPagePath = (file: string, config: Config): string => {
  return file.split(sep + config.viewsDir + sep)[1];
};

export {
  getPagePath,
}
