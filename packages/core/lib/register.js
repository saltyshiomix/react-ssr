const { isProd } = require('./helpers');

if (isProd()) {
  module.exports = require('../dist/production/register');
} else {
  module.exports = require('../dist/development/register');
}
