
import config from './config/index.js';
import debug from './debug.js';
import setup from './setup/index.js';
import server from './server.js';


const privateApi = {};

/**
 * Map with accepted arguments that should have value
 *
 * @type {Object}
 */
privateApi.argsMapWithVal = {
  c: 'config',
  config: 'config',
  t: 'tokens',
  tokens: 'tokens',
};

/**
 * Map with accepted arguments that do not require to have value
 *
 * @type {Object}
 */
privateApi.argsMapWithoutVal = {
  d: 'debug',
  debug: 'debug',
};

/**
 * Extract arguments that may be useful
 *
 * @return {Array<String>}
 */
privateApi.getArgs = () => (
  process.argv.slice(2)
);

/**
 * Extract arguments that can be used
 *
 * @param {Array<String>} args
 * @return {Object} argsMap
 */
privateApi.extractArgs = (args) => {
  const acceptedArgsWithVal = Object.keys(privateApi.argsMapWithVal);
  const argWithValRegExp = new RegExp(
    `^\\s?--?(${acceptedArgsWithVal.join('|')})=(.*)`
  );
  const acceptedArgsWithoutVal = Object.keys(privateApi.argsMapWithoutVal);
  const argWithoutValRegExp = new RegExp(
    `^\\s?--?(${acceptedArgsWithoutVal.join('|')}).*`
  );

  return args
    .reduce(
      (acc, arg) => {
        let matches = arg.match(argWithValRegExp);

        if (matches && matches.length === 3) {
          const argKey = privateApi.argsMapWithVal[matches[1].trim()];
          const argVal = matches[2].trim();
          if (argKey && argVal) {
            acc[argKey] = argVal;
          }
        } else {
          matches = arg.match(argWithoutValRegExp);
          if (matches && matches.length === 2) {
            const argKey = privateApi.argsMapWithoutVal[matches[1].trim()];
            acc[argKey] = true;
          }
        }

        return acc;
      },
      {
        config: '.amiddy'
      }
    );


};


const service = {};

/**
 * Parse arguments from cli and setup
 */
service.run = () => {
  // extract arguments that are useful
  const args = privateApi.getArgs();
  // create object with arguments
  const filteredArgs = privateApi.extractArgs(args);

  const hasDebugProp = Object.prototype.hasOwnProperty.call(filteredArgs, 'debug');
  if (hasDebugProp) {
    debug.activate();
  }

  const configObj = config.get(filteredArgs);

  debug.block(
    '\nUsing options:',
    filteredArgs,
    '\nUsing configuration:',
    JSON.stringify(configObj)
  );

  setup.init(configObj);

  server.create(configObj);

};


// only for testing
export {privateApi};

export default service;
