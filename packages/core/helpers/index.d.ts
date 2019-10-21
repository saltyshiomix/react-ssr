import Config from '../express/config';

declare namespace ReactSsrHelper {
  export function getEngine(): 'jsx' | 'tsx';
  export function getBabelrc(): string;
  export function getPages(config: Config): Promise<string[][]>;
  export function getPageId(page: string, config: Config, separator?: string): string;
  export function readFileWithProps(file: string, props: any): string;
  export function gracefullyShutDown(getPort: () => number): Promise<void>;
  export function sleep(ms: number): Promise<void>;
}

export = ReactSsrHelper;
