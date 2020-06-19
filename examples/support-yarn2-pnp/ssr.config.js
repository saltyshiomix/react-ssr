const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
  webpack: (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      PnpWebpackPlugin,
    ];

    config.resolveLoader.plugins = [
      ...(config.resolveLoader.plugins || []),
      PnpWebpackPlugin.moduleLoader(module),
    ];

    return config;
  },
};
