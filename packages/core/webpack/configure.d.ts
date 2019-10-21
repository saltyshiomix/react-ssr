import webpack from 'webpack';

declare function configure(entry: webpack.Entry, cacheDir: string): webpack.Configuration;

export = configure;
