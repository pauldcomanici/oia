
// services
import loggingData from './logging.js';

/**
 * Utils service that prepares plugin options.
 * Contains methods that help with defaults and constructing options that can be used by the plugin.
 *
 * @private
 * @mixin
 */
const privateApi = {};

/**
 * Prepare options for the plugin.
 * Contains methods that help with defaults and constructing options that can be used by the plugin.
 *
 * @mixin
 */
const service = {};

/**
 * Get regular expression based on provided matcher
 *
 * @param {String|Array<String>} matcher - string or array with strings based on which regular expression is created
 * @param {String} matcherName - name of the property
 * @param {Array<String>} defaultMatcher - default value for matcher
 *
 * @return {RegExp|Error} regular expression or exception
 */
privateApi.getMatcher = (matcher, matcherName, defaultMatcher = []) => {
  let matcherForRegExp;

  if (matcher) {
    const matcherAsArray = Array.isArray(matcher);

    if (matcherAsArray) {
      const validMatcher = matcher
        .filter(Boolean)
        .map((stringMatcher) => `(${stringMatcher})`);

      matcherForRegExp = validMatcher.join('|');
    } else if (typeof matcher === 'string') {
      matcherForRegExp = matcher;
    } else {
      throw new Error(`[babel-auto-logger-plugin] '${matcherName}' can be string or array with strings`);
    }
  } else {
    // use default
    matcherForRegExp = defaultMatcher
      .map((stringMatcher) => `(${stringMatcher})`)
      .join('|');
  }

  return new RegExp(matcherForRegExp);
};

/**
 * Get default value for sourceMatcher.
 *
 * @default
 *
 * @return {Array<String>} defaultSourceMatcher
 */
privateApi.getSourceMatcher = () => (
  [
    '.*js(x)?$',
  ]
);

/**
 * Get default value for sourceExcludeMatcher.
 *
 * @default
 *
 * @return {Array<String>} defaultSourceExcludeMatcher
 */
privateApi.getSourceExcludeMatcher = () => (
  [
    '__fixtures__',
    '__mocks__',
    '__tests__',
    '__snapshots__',
    'node_modules',
  ]
);

/**
 * Prepare configuration for output
 *
 * @param {PluginConfigOutput} [settings]
 * @return {PluginConfigOutput}
 */
privateApi.getOutput = (settings) => {
  const validTypes = [
    'simple',
    'object',
  ];
  const options = {
    argsAsObject: false,
    type: 'simple',
  };

  if (settings && typeof settings === 'object') {
    const useType = settings.type;
    const isValidType = validTypes.includes(useType);
    if (isValidType) {
      options.type = useType;
      options.argsAsObject = settings.argsAsObject === true;

      if (useType === 'object') {
        options.source = settings.source || 'source';
        options.name = settings.name || 'name';
        options.args = settings.args || 'args';
      }
    }
  }

  return options;
};

/**
 * Prepare options for the plugin
 *
 * @param {PluginConfigObj} receivedOptions - object with options (state.opts)
 * @return {Object} options - object with options for the plugin
 */
service.prepare = (receivedOptions) => {
  const options = {};

  // source matcher
  // if we do not receive value for `sourceMatcher` add empty string by default (will match everything)
  options.sourceMatcher = privateApi.getMatcher(
    receivedOptions.sourceMatcher,
    'sourceMatcher',
    privateApi.getSourceMatcher()
  );

  // source exclusion matcher
  // if we do not receive value for sourceExcludeMatcher use default (see privateApi.getSourceExcludeMatcher)
  options.sourceExcludeMatcher = privateApi.getMatcher(
    receivedOptions.sourceExcludeMatcher,
    'sourceExcludeMatcher',
    privateApi.getSourceExcludeMatcher()
  );

  // logging output
  options.output = privateApi.getOutput(receivedOptions.output);

  // logging data
  options.loggingData = loggingData.getOptions(receivedOptions.loggingData);

  return options;
};

// only for testing
export {
  privateApi,
};

export default service;
