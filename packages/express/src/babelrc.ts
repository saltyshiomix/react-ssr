import { existsSync } from 'fs';
import { resolve } from 'path';

const cwd: string = process.cwd();

export default (): string => {
  if (existsSync(resolve(cwd, '.babelrc'))) return resolve(cwd, '.babelrc');
  if (existsSync(resolve(cwd, '.babelrc.js'))) return resolve(cwd, '.babelrc.js');
  if (existsSync(resolve(cwd, 'babel.config.js'))) return resolve(cwd, 'babel.config.js');
  return resolve(__dirname, '../babel.config.default.js');
}
