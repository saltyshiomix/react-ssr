import { sep } from 'path';

export const getPagePath = (file: string, viewsDir: string): string => {
  return file.split(sep + viewsDir + sep)[1];
};
