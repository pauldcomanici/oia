import stripComments from 'strip-json-comments';
import merge from 'lodash.merge';
import chalk from 'chalk';

import file from '../file.js';
import debug from '../debug.js';


const privateApi = {};

/**
 * Loads a file.
 *
 * @param {String} filePath - The filename to load.
 * @return {String} output - The file content.
 * @throws {Error} If the file cannot be read.
 */
privateApi.loadFile = (filePath) => {
  debug.log(`Loading file: ${filePath}`);

  try {
    return stripComments(file.read(filePath));
  } catch (e) {
    debug.log(`Error reading file: ${filePath}`);
    e.message = `Cannot read file: ${filePath}\nError: ${e.message}`;
    e.messageData = {
      message: e.message,
      path: filePath,
    };
    throw e;
  }
};

/**
 * Loads a JSON from a file.
 *
 * @param {String} filePath - The filename to load.
 * @return {Object} output - The object from the file.
 * @throws {Error} If the file cannot be read.
 */
privateApi.loadJSONFile = (filePath) => {
  debug.log(`Loading JSON file: ${filePath}`);

  try {
    return JSON.parse(privateApi.loadFile(filePath));
  } catch (e) {
    debug.log(`Error reading JSON file: ${filePath}`);
    e.message = `Cannot read JSON file: ${filePath}\nError: ${e.message}`;
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
 * Update config object with defaults for proxy
 *
 * @param {Object} configObj
 */
privateApi.setProxyDefaults = (configObj) => {
  configObj.proxy = merge(
    {
      options: {
        changeOrigin: false,
        secure: false,
        ws: false,
      },
      response: {
        headers: {},
      },
    },
    configObj.proxy,
  );
};

/**
 * Update config object with defaults for amiddy options
 *
 * @param {Object} configObj
 */
privateApi.setOptionDefaults = (configObj) => {
  configObj.options = merge(
    {
      mock: {
        enabled: true,
      },
      recorder: {
        enabled: false,
        fileNamePattern: '{METHOD}-{PATH}.{EXT}',
        ignorePatterns: [
          '**favicon*'
        ],
        path: '__amiddy__/records',
      },
    },
    configObj.options,
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
  privateApi.setProxyDefaults(configObj);
  privateApi.setOptionDefaults(configObj);
};

/**
 * Generate config object by replacing tokens from base json
 *
 * @param {String} config
 * @param {Object} tokensObj
 * @return {Object} configObj
 */
privateApi.generateConfig = (config, tokensObj) => {
  const warnColored = chalk.hex('#C03D29');

  const updatedConfig = Object.keys(tokensObj)
    .reduce(
      (acc, token) => {
        const regExp = new RegExp(token, 'g');
        const hasMatch = regExp.test(acc);

        if (hasMatch) {
          return acc.replace(regExp, tokensObj[token]);
        }

        // eslint-disable-next-line no-console, max-len
        console.warn(`${warnColored('Token')} ${warnColored.bold(token)} ${warnColored('was not wound in base configuration')}`);
        return acc;
      },
      config
    );

  try {
    return JSON.parse(updatedConfig);
  } catch (e) {
    const msg = 'Error parsing config as JSON';
    debug.log(msg);
    e.message = `${msg} ${e.message}`;
    throw e;
  }
};


const service = {};

/**
 * Get configuration. If no path is provided will use `.amiddy` file
 *  that should be at the same level with package.json
 *
 * @param {Object} props
 * @param {String} props.config
 * @param {String} [props.tokens]
 * @return {Object}
 */
service.get = (props) => {
  let configObj;

  const tokens = props.tokens;
  const configPath = file.getAbsolutePath(props.config);
  if (tokens) {
    // when we do not have placeholders -> read config as string & replace tokens
    const tokensPath = file.getAbsolutePath(tokens);
    const tokensObj = privateApi.loadJSONFile(tokensPath);
    const config = privateApi.loadFile(configPath);
    configObj = privateApi.generateConfig(config, tokensObj);
  } else {
    // when we do not have placeholders -> take the config file directly
    configObj = privateApi.loadJSONFile(configPath);
  }

  privateApi.validate(configObj);

  privateApi.setDefaults(configObj);

  return configObj;
};


// only for testing
export {privateApi};

export default service;
