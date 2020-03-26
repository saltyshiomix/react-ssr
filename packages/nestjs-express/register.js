const register = async app => {
  const expressApp = app.getHttpAdapter().getInstance();
  await require('@react-ssr/core/lib/register')(expressApp);
};

module.exports = register;
module.exports.default = register;
