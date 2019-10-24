const config = require('./config');

module.exports = (api) => {
  api.cache(true);
  return config;
}
