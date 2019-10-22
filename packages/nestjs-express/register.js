require('@babel/register')();

const register = require('./dist/register');

module.exports = register;
module.exports.default = register;
