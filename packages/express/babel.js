module.exports = () => {
  return {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
    ],
    plugins: [
      require('babel-plugin-react-require'),
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-proposal-class-properties'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true,
      }],
      [require('@babel/plugin-transform-runtime'), {
        corejs: 2,
        helpers: true,
        regenerator: true,
        useESModules: false,
      }],
    ],
  };
}
