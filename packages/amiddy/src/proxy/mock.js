
import file from '../file';
import logger from '../logger';

import proxyRegistry from './registry';
import proxyUtils from './utils';

const privateApi = {};

/**
 * Get the headers that should be set on the response
 *
 * @param {Object} mock
 * @param {Object} options
 * @return {Object}
 */
privateApi.getHeaders = (mock, options) => {
  const headers = options && options.headers || {};

  const mockHeaders = mock.headers || {};
  Object.keys(mockHeaders).forEach(
    (header) => {
      headers[header] = mockHeaders[header];
    }
  );

  return headers;
};

/**
 * Get the response that should be returned
 *
 * @param {Object} mock
 * @return {String}
 */
privateApi.getResponse = (mock) => {
  let response = mock.response || '';
  if (mock.fixture) {
    try {
      const absPath = file.getAbsolutePath(mock.fixture);
      response = file.read(absPath);
    } catch (e) {
      logger.error(e.message);
    }
  }

  try {
    response = JSON.parse(response);
  } catch (e) {}

  return response;
};

/**
 * Get data for the mock
 *
 * @param {Object} dependency
 * @param {String} url
 * @param {String} method
 * @param {Object} options
 * @return {Object}
 */
privateApi.get = (dependency, url, method, options) => {
  const mock = proxyUtils.getMock(dependency.mocks, url, method);

  if (mock) {
    const headers = privateApi.getHeaders(mock, options);
    const response = privateApi.getResponse(mock);
    const status = mock.status || 200;

    return {
      headers,
      response,
      status,
    };
  }

  return undefined;
};

const service = {};

/**
 * Mock request
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Object} dependency
 * @param {Object} config
 * @return {Boolean}
 */
service.execute = (req, res, dependency, config) => {
  if (!config.options.mock.enabled) {
    // if mocking is disabled => stop
    return false;
  }

  const url = req.url;
  const method = req.method;

  const mock = privateApi.get(dependency, url, method, config.proxy.response);

  if (mock) {
    const responseHeaders = mock.headers;
    responseHeaders && Object.keys(responseHeaders).forEach(
      (headerName) => {
        res.setHeader(headerName, responseHeaders[headerName]);
      }
    );

    res.status(mock.status);
    res.send(mock.response);

    const data = proxyRegistry.generateEntry(
      {
        method: method,
        path: url,
      },
      {
        target: proxyUtils.buildUrlObject(dependency),
      }
    );

    logger.response(
      data,
      {
        statusCode: mock.status,
      }
    );
    return true;
  }

  return false;
};

export {privateApi};
export default service;
