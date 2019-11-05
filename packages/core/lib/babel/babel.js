const config = require('./config');

module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV === 'production');
  return config;
}
