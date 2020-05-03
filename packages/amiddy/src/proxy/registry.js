import url from 'url';


/**
 * Private API for proxy registry
 *
 * @protected
 * @const {Object}
 */
const privateApi = {};

/**
 * Request identification
 *
 * @default
 * @const {Number}
 */
privateApi.id = 0;

/**
 * Map with registered requests.
 * Key is the request ID and value is an object with request specific data
 *
 * @default
 * @const {Object}
 */
privateApi.registry = {};


const service = {};

/**
 * Get registry data based on id
 *
 * @param {String} id - identification
 * @return {Object}
 */
service.get = (id) => (
  privateApi.registry[id] || {}
);

/**
 * Clear registry data based on id
 *
 * @param {String} id - identification
 */
service.clear = (id) => {
  privateApi.registry[id] = undefined;
};

/**
 * Set request to registry
 *
 * @param {http.ClientRequest} proxyReq
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Object} options
 */
service.set = (proxyReq, req, res, options) => {
  // request started time
  const startTime = global.Date.now();

  // get unique id
  const id = privateApi.id;
  // set unique id (used for next request)
  privateApi.id += 1;


  // Get proxy target uri
  const target = Object.assign(
    options.target,
    {pathname: proxyReq.path}
  );
  const uri = decodeURIComponent(url.format(target));

  // store ID on the request
  req.__amiddyId__ = id;
  // store ID on the response
  res.__amiddyId__ = id;

  privateApi.registry[id] = {
    method: proxyReq.method,
    startTime,
    uri,
  };
};


// only for testing
export {privateApi};

export default service;
