const { isProd } = require('../helpers');

if (isProd()) {
  module.exports = require('../../dist/production/document');
} else {
  module.exports = require('../../dist/development/document');
}
