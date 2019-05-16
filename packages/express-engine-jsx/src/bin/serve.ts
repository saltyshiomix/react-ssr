import spawn from 'cross-spawn';

export default function serve(server: string, showConsole: boolean) {
  const proc = spawn('node', [server], {
    cwd: process.cwd(),
    // stdio: showConsole ? 'inherit' : 'ignore',
    stdio: 'inherit',
  });

  proc.on('close', (code: number, signal: string) => {
    if (code !== null) {
      process.exit(code);
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137);
      }
      process.exit(1);
    }
    process.exit(0);
  });

  proc.on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
  });

  return proc;
}
