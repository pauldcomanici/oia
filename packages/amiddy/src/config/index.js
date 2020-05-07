import stripComments from 'strip-json-comments';

import file from '../file';
import debug from '../debug';


const privateApi = {};

/**
 * Loads a JSON configuration from a file.
 *
 * @param {String} filePath - The filename to load.
 * @return {Object} config - The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 */
privateApi.loadJSONConfigFile = (filePath) => {
  debug.log(`Loading JSON config file: ${filePath}`);

  try {
    return JSON.parse(stripComments(file.read(filePath)));
  } catch (e) {
    debug.log(`Error reading JSON file: ${filePath}`);
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
    e.messageData = {
      message: e.message,
      path: filePath,
    };
    throw e;
  }
};

/**
 * Test if the provided config object is valid
 *
 * @param {Object} configObj
 * @throws {Error}
 */
privateApi.validate = (configObj) => {
  const vhostConf = configObj.vhost;
  if (!vhostConf) {
    throw Error('Missing `vhost` property');
  }
  if (!vhostConf.name) {
    throw Error('Missing `vhost.name` property');
  }

  const source = configObj.source;
  if (source && (typeof source !== 'object' || Array.isArray(source))) {
    throw Error('`source` property should be an object');
  }

  const deps = configObj.deps;
  if (!deps) {
    throw Error('Missing `deps` property');
  }

  if (!Array.isArray(deps)) {
    throw Error('`deps` property should be an array');
  }

  const depErrors = [];
  deps.forEach(
    (dep, index) => {
      if (!dep.ip && !dep.name) {
        depErrors.push(`Dependency with index ${index} is missing "ip" or "name"`);
      }
      if (!dep.patterns || !Array.isArray(dep.patterns) || dep.patterns.length < 1) {
        depErrors.push(`Dependency with index ${index} should have patterns defined as array of strings`);
      }
    }
  );

  if (depErrors.length > 0) {
    throw Error(depErrors.join(' \n'));
  }
};

/**
 * Get value for port.
 *
 * @param {Boolean} [https=false]
 * @param {Number} [defaultPort]
 * @return {Number} port
 */
privateApi.getPort = (https, defaultPort) => {
  if (defaultPort) {
    return defaultPort;
  }

  return https ? 443 : 80;
};

/**
 * Update config object with defaults for source
 *
 * @param {Object} configObj
 */
privateApi.setSourceDefaults = (configObj) => {
  configObj.source = configObj.source || {};

  configObj.source.ip = configObj.source.ip || '127.0.0.1';

  configObj.source.https = configObj.source.https || false;

  configObj.source.port = configObj.source.port || privateApi.getPort(configObj.source.https, 3000);
};

/**
 * Update config object with defaults for vhost
 *
 * @param {Object} configObj
 */
privateApi.setVhostDefaults = (configObj) => {
  configObj.vhost.https = configObj.vhost.https || false;
  configObj.vhost.port = configObj.vhost.port || privateApi.getPort(configObj.vhost.https);
};

/**
 * Update config object with defaults for every dependency
 *
 * @param {Object} configObj
 */
privateApi.setDepsDefaults = (configObj) => {
  configObj.deps.forEach(
    (dep) => {
      dep.https = dep.https || false;
      dep.port = dep.port || privateApi.getPort(dep.https);
    }
  );
};

/**
 * Update config object with defaults
 *
 * @param {Object} configObj
 */
privateApi.setDefaults = (configObj) => {
  privateApi.setSourceDefaults(configObj);
  privateApi.setVhostDefaults(configObj);
  privateApi.setDepsDefaults(configObj);

};


const service = {};

/**
 * Get configuration. If no path is provided will use `.amiddy` file
 *  that should be at the same level with package.json
 *
 * @param {String} [pathToResolve]
 * @return {Object}
 */
service.get = (pathToResolve) => {
  const pathToUse = pathToResolve || '.amiddy';
  const absolutePath = file.getAbsolutePath(pathToUse);

  const configObj = privateApi.loadJSONConfigFile(absolutePath);

  privateApi.validate(configObj);

  privateApi.setDefaults(configObj);

  return configObj;
};


// only for testing
export {privateApi};

export default service;
