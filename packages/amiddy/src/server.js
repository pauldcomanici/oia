import http from 'http';
import https from 'https';

import express from 'express';


import logger from './logger.js';
import certificate from './certificate.js';
import proxy from './proxy/index.js';


const privateApi = {};

/**
 * Listener for when the server starts
 *
 * @param {String} message
 * @return {Function}
 */
privateApi.listen = (message) => () => {
  logger.success('');
  logger.success('Started', 'server-start');
  logger.success(message, 'server-start');
  logger.success('');
};

const service = {};

/**
 * Create server
 *
 * @param {Object} config
 */
service.create = (config) => {
  let server;

  const app = express();
  const vhostConf = config.vhost;
  const isHttps = vhostConf.https;
  const protocol = isHttps ? 'https' : 'http';
  let ssl = null;
  if (isHttps) {
    const sslConfig = config.sslFiles;
    if (sslConfig) {
      ssl = certificate.read(sslConfig);
    } else {
      // use selfsigned as backup
      ssl = certificate.generate(vhostConf.name, config.selfsigned);
    }
  }

  app.use(proxy.create(config, ssl));

  // remove `x-powered-by` header
  app.disable('x-powered-by');

  if (isHttps) {
    server = https.createServer({
      cert: ssl.cert,
      key: ssl.key || ssl['private'],
    }, app);
  } else {
    server = http.createServer(app);
  }


  const message = `Open: ${protocol}://${vhostConf.name}:${vhostConf.port}`;
  server.listen(vhostConf.port, privateApi.listen(message));
};


// only for testing
export {privateApi};

export default service;
