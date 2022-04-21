"use strict";

module.exports = function (api) {
  const env = api.env();
  api.cache.never();

  const envConfig = {
    modules: false,
    targets: {
      node: true,
    },
  };

  if (env === 'test') {
    envConfig.modules = 'auto';
  }

  return {
    comments: false,
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
      [
        '@babel/preset-env',
        envConfig,
      ],
      [
        'minify',
        {
          mangle: false,
        }
      ],
    ],
    shouldPrintComment: (value) => (/.*@typedef /.test(value)),
  };
};
