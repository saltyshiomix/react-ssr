module.exports = () => {
  const presets = [
    require('@babel/preset-env'),
    require('@babel/preset-react'),
    require('@babel/preset-typescript'),
  ];

  const plugins = [
    require('babel-plugin-react-require'),
    require('babel-plugin-css-modules-transform'),
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
  ];

  return {
    presets,
    plugins,
  };
}
