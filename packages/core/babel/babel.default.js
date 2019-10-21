const { presets, plugins } = require('./helpers');

module.exports = (api) => {
  api.cache(true);
  return { presets, plugins };
}
