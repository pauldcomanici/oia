
/**
 * Private api for debug
 *
 * @protected
 * @const {Object}
 */
const privateApi = {};

/**
 * Store if we are in debug mode
 *
 * @type {Boolean}
 */
privateApi.isActive = false;


const service = {};

/**
 * Activate debug mode
 */
service.activate = () => {
  privateApi.isActive = true;
};

/**
 * Log message
 *
 * @param {String} msg
 */
service.log = (msg) => {
  privateApi.isActive && console.debug(msg); // eslint-disable-line no-console
};

/**
 * Log multiple messages
 *
 * @param {...String} msgs
 */
service.block = (...msgs) => {
  privateApi.isActive && msgs.forEach(
    (msg) => {
      console.debug(msg); // eslint-disable-line no-console
    }
  );
};


// only for testing
export {privateApi};

export default service;
