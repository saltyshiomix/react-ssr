import ora from 'ora';
import chalk from 'chalk';

const cache: any = {};
const isTTY: boolean = process.env.CI ? false : process.stdout.isTTY;

export function create(text: string) {
  if (!isTTY) {
    console.log(chalk`{cyan [react-ssr]} ${text}`);
    return;
  }

  const { spinner } = cache;
  if (spinner) {
    spinner.succeed();
    delete cache.spinner;
  }

  cache.spinner = ora({
    text,
    color: 'magenta',
  }).start();
}

export function clear(message: string, isError?: boolean) {
  if (!isTTY) {
    console.log(chalk`{cyan [react-ssr]} ${message}`);
    return;
  }

  const { spinner } = cache;
  if (spinner) {
    isError ? spinner.fail() : spinner.succeed();
    delete cache.spinner;
    console.log('');
  }

  const prefix = isError ? chalk.red('Error!') : chalk.green('Done!');
  console.log(`${prefix} ${message}`);
}

export function fail(message: string) {
  clear(message, true);
  process.exit(1);
}
