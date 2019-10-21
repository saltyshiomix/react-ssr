import Config from '../express/config';

declare function render(file: string, props: object, config: Config): Promise<string>;

export = render;
