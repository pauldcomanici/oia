import logger from '../logger';
import proxyRegistry from './registry';


const service = {};

/**
 * Listen to the request event
 *
 * @param {Object} proxyReq
 * @param {Object} req
 * @param {Object} res
 * @param {Object} options
 */
service.request = (proxyReq, req, res, options) => {
  proxyRegistry.set(proxyReq, req, res, options);
};

/**
 * Listen to the response event
 *
 * @param {Object} proxyRes
 * @param {Object} req
 * @param {Object} res
 */
service.response = (proxyRes, req, res) => {
  const id = req.__amiddyId__;
  if (id === res.__amiddyId__) {
    // we get response for the request
    const data = proxyRegistry.get(id);
    logger.response(data, proxyRes);

    proxyRegistry.clear(id);
  }
};

/**
 * Listen to error event
 * @param {Object} error
 * @param {Object} req
 * @param {Object} res
 */
service.error = (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    logger.error(error.message, 'proxy');
  }

  if (!res.headersSent) {
    res.writeHead(500);
  }

  res.end(`Proxy error occurred: ${error.message}`);
};

export default service;
