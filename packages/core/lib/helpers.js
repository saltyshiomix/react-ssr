const isProd = () => {
  let env = process.env.NODE_ENV || 'development';
  if (process.env.REACT_SSR_ENV) {
    env = process.env.REACT_SSR_ENV;
  }
  return env === 'production';
};

module.exports = {
  isProd,
};
