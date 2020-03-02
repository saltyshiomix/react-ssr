if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/production/register');
} else {
  module.exports = require('../dist/development/register');
}
