const isProduction = process.env.NODE_ENV === 'production';

module.exports = (api) => {
  api.cache(() => isProduction);

  return {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      require('babel-plugin-react-require'),
      require('babel-plugin-css-modules-transform'),
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-proposal-class-properties'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true,
      }],
      require('@babel/plugin-transform-react-jsx'),
      [require('@babel/plugin-transform-runtime'), {
        corejs: 3,
        helpers: true,
        regenerator: true,
        useESModules: false,
      }],
      isProduction && [
        require('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  };
}
