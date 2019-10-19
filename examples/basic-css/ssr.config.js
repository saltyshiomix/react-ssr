module.exports = {
  webpack: (config, env) => {
    config.module.rules = [
      ...(config.module.rules),
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ];
    return config;
  },
};
