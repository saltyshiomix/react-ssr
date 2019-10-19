const express = require('express');
const e = require('./dist/index');

e.prototype = Object.create(express.prototype);
for (let i in express) {
  e[i] = express[i];
}

module.exports = e;
module.exports.default = e;
