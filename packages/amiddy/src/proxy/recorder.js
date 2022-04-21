
import micromatch from 'micromatch';
import mime from 'mime-types';

import file from '../file.js';
import proxyUtils from './utils.js';


const privateApi = {};

/**
 * Get file name based on pattern
 *
 * @param {String} pattern
 * @param {Object} data
 * @return {String}
 */
privateApi.getFileName = (pattern, data) => {
  let path = data.path;
  // ignore from query char
  let ignoreFromChar = path.indexOf('?');
  const anchorCharIndex = path.indexOf('#');
  if (
    anchorCharIndex > -1 &&
    (anchorCharIndex < ignoreFromChar || ignoreFromChar === -1)
  ) {
    ignoreFromChar = anchorCharIndex;
  }
  if (ignoreFromChar > -1) {
    path = path.substr(0, ignoreFromChar);
  }
  // now replace /
  path = path.replace(/[/.]/g, '_');

  return pattern
    .replace(/{METHOD}/, data.method)
    .replace(/{PATH}/, path)
    .replace(/{EXT}/, data.ext)
    .replace(/{STATUS}/, data.status);
};

/**
 * Save body to file
 *
 * @param {String} body
 * @param {http.ClientRequest} proxyRes
 * @param {Object} config
 */
privateApi.saveToFile = (body, proxyRes, config) => {
  const {
    headers,
    req: {
      method,
      path,
    },
    statusCode,
  } = proxyRes;
  const {
    deps,
    options: {
      recorder: {
        fileNamePattern,
        ignorePatterns,
        path: recorderPath,
      },
    },
  } = config;

  // do not save if path is from source
  let shouldIgnore = !proxyUtils.getDependency(deps, path);
  // do not save if path is in the ignore patterns list
  if (!shouldIgnore) {
    shouldIgnore = micromatch.isMatch(path, (ignorePatterns || []), {contains: true});
  }

  if (!shouldIgnore) {
    const ext = mime.extension(headers['content-type']);

    let filePath = privateApi.getFileName(
      fileNamePattern,
      {
        ext,
        method,
        path,
        status: statusCode,
      },
    );

    if (recorderPath) {
      filePath = `${recorderPath}/${filePath}`;
    }

    file.write(filePath, body);
  }
};


const service = {};

/**
 * Save response
 *
 * @param {http.ClientRequest} proxyRes
 * @param {Object} config
 */
service.saveResponse = (proxyRes, config) => {
  if (config.options.recorder.enabled) {
    let body = [];
    proxyRes.on('data', (chunk) => {
      body.push(chunk);
    });
    proxyRes.on('end', () => {
      body = Buffer.concat(body).toString();
      privateApi.saveToFile(body, proxyRes, config);
    });
  }
};

export {privateApi};
export default service;
