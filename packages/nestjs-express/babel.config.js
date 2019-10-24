module.exports = (api) => {
  api.cache.never();

  const presets = [
    require('@babel/preset-typescript'),
  ];

  const plugins = [
    require('@babel/plugin-proposal-class-properties'),
    require('@babel/plugin-proposal-object-rest-spread'),
  ];

  return {
    presets,
    plugins,
  };
}
