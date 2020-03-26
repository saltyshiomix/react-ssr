const { isProd } = require('../helpers');

if (isProd()) {
  module.exports = require('../../dist/production/head');
} else {
  module.exports = require('../../dist/development/head');
}
