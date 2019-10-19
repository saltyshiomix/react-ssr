module.exports = {
  webpack: (config, env) => Object.assign(config, {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
  }),
};
