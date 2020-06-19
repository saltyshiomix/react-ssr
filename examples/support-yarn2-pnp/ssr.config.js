const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
  webpack: (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      PnpWebpackPlugin,
    ];

    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }
    config.resolveLoader.plugins = [
      ...(config.resolveLoader.plugins || []),
      PnpWebpackPlugin.moduleLoader(module),
    ];

    return config;
  },
};
