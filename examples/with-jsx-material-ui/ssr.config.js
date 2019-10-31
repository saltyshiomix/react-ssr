module.exports = {
  id: 'material-ui',
  webpack: (config, env) => {
    config.module.rules = [
      ...(config.module.rules || []),
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000',
      },
    ];
    return config;
  },
};
