import { existsSync } from 'fs';
import { resolve } from 'path';

const cwd: string = process.cwd();

export default (): 'jsx'|'tsx' => {
  if (existsSync(resolve(cwd, 'tsconfig.json'))) {
    return 'tsx';
  }
  return 'jsx';
};
