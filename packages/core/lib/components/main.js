const { isProd } = require('../helpers');

if (isProd()) {
  module.exports = require('../../dist/production/main');
} else {
  module.exports = require('../../dist/development/main');
}
