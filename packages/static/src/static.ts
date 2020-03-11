const defaultCommand = 'dev';
const commands = new Set([
  'build',
  defaultCommand,
]);

let cmd = process.argv[2];
let args: string[] = [];

if (commands.has(cmd)) {
  args = process.argv.slice(3);
} else {
  cmd = defaultCommand;
  args = process.argv.slice(2);
}

const defaultEnv = cmd === 'dev' ? 'development' : 'production';
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;

if (cmd === 'dev') {
  import('./static-dev');
} else if (cmd === 'build') {
  import('./static-build');
} else {
  throw new Error(`${cmd} not supported`);
}
