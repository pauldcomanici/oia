import httpProxy from 'http-proxy';
import vhost from 'vhost';

import proxyMock from './mock.js';
import proxyListen from './listen.js';
import proxyUtils from './utils.js';


const privateApi = {};

/**
 * Get proxy response options
 *
 * @param {Object} config
 * @return {Object}
 */
privateApi.getResponseOptions = (config) => {
  const options = {
    headers: {},
  };

  const proxyResponseOptions = config && config.proxy && config.proxy.response || {};
  const proxyResponseHeaders = proxyResponseOptions.headers;
  if (proxyResponseHeaders && typeof proxyResponseHeaders === 'object') {
    options.headers = proxyResponseHeaders;
  }

  return options;
};

/**
 * Returns callback for vhost
 *
 * @param {Object} proxy
 * @param {Object} ssl
 * @param {Object} config
 * @return {Function}
 */
privateApi.vhostCb = (proxy, ssl, config) => {
  // source conf
  const source = config.source;
  // vhost conf
  const vhostConf = config.vhost;
  // base proxy config, can be overwritten by every dependency
  const proxyConf = config.proxy;
  // base proxy config, can be overwritten by every dependency
  const proxyOptions = proxyConf.options;
  // dependencies
  const deps = config.deps;

  return (req, res) => {

    // get dependency that will proxy this request
    const dependency = proxyUtils.getDependency(deps, req.url);

    const mockedResponse = proxyMock.execute(req, res, (dependency || source), config);

    if (!mockedResponse) {
      const useProxyOptions = {
        ...proxyOptions,
        headers: {
          ...proxyOptions.headers,
          host: vhostConf.name,
        },
        target: proxyUtils.buildUrl(source),
      };

      // extend proxy options if there is a dependency that will be used as proxy
      proxyUtils.extendOptions(useProxyOptions, ssl, dependency);

      // proxy request
      proxy.proxyRequest(req, res, useProxyOptions);
    }

  };
};


const service = {};

/**
 * Create proxy middleware.
 * Return `vhost` middleware.
 *
 * @param {Object} config
 * @param {Object} ssl
 * @return {Object} vhost
 */
service.create = (config, ssl) => {

  // create proxy
  const proxy = httpProxy.createProxyServer();

  // request
  proxy.on('proxyReq', proxyListen.request);

  // response
  proxy.on('proxyRes', proxyListen.response(config));

  // error
  proxy.on('error', proxyListen.error);

  return vhost(config.vhost.name, privateApi.vhostCb(proxy, ssl, config));
};


// only for testing
export {privateApi};

export default service;
