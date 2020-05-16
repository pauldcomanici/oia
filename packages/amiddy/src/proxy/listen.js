import logger from '../logger';
import proxyRegistry from './registry';
import proxyRecorder from './recorder';


const service = {};

/**
 * Listen to the request event
 *
 * @param {http.ClientRequest} proxyReq
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Object} options
 */
service.request = (proxyReq, req, res, options) => {
  proxyRegistry.set(proxyReq, req, res, options);
};

/**
 * Listen to the response event
 *
 * @param {Object} config
 *
 * @return {Function} handleResponse
 */
service.response = (config) =>

  /**
   * Response handler for the proxy
   *
   * @param {http.ClientRequest} proxyRes
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  (proxyRes, req, res) => {
    const id = req.__amiddyId__;
    if (id === res.__amiddyId__) {
      proxyRecorder.saveResponse(proxyRes, config);

      // we get response for the request
      const data = proxyRegistry.get(id);
      logger.response(data, proxyRes);

      proxyRegistry.clear(id);

      const responseHeaders = config.proxy.response.headers;
      Object.keys(responseHeaders).forEach(
        (headerName) => {
          res.setHeader(headerName, responseHeaders[headerName]);
        }
      );
    }
  };

/**
 * Listen to error event
 * @param {Object} error
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
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
