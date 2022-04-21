"use strict";

module.exports = function (api) { // eslint-disable-line no-undef
  api.cache.never();

  const envConfig = {
    targets: {
      node: true,
    },
  };

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
