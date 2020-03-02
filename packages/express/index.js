const dist = process.env.NODE_ENV === 'production' ? 'dist/production' : 'dist/development';
module.exports.Document = require(`@react-ssr/core/${dist}/document`);
module.exports.Head = require(`@react-ssr/core/${dist}/head`);
module.exports.Main = require(`@react-ssr/core/${dist}/main`);
