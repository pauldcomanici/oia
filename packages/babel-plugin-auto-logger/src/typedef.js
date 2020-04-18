/**
 * Type definition
 */

/**
 * Plugin settings for log level
 *
 * @typedef {Object} LoggerLevelObj
 * @property {String} matchSource - regular expression as string for sources that should have current log level
 * @property {String|RegExp} matchSourceRegExp - regular expression based on `matchSource` or empty string if `matchSource` has falsy value
 * @property {String} matchFunctionName - regular expression as string for function name that should have current log level
 * @property {String|RegExp} matchFunctionNameRegExp - regular expression based on `matchFunctionName` or empty string if `matchFunctionName` has falsy value
 * @property {String} methodName - property name for logger object that is a function and will be called for this log level
 */

/**
 * Plugin Settings for levels for logging data
 *
 * @typedef {Object} LoggerLevelsObj
 * @property {LoggerLevelObj} debug - debug level settings
 * @property {LoggerLevelObj} error - error level settings
 * @property {LoggerLevelObj} info - info level settings
 * @property {LoggerLevelObj} log - log level settings
 * @property {LoggerLevelObj} warn - warn level settings
 */

/**
 * Plugin Settings for logging data
 *
 * @typedef {Object} LoggerDataObj
 * @property {String} [levelForMemberExpressionCatch] - logging level that should be used when `catch` is a member of an expression (e.g. Promise.catch)
 * @property {String} [levelForTryCatch] - logging level that should be used in `catch` block
 * @property {String} [source] - logger source, npm package
 * @property {String} [name='console'] - logger name, name for the import, if is not specified or it is 'console' no import will be made
 * @property {LoggerLevelsObj} levels - object with log levels
 */

/**
 * Plugin Settings for output
 *
 * @typedef {Object} PluginConfigOutput
 * @property {String} [type='simple'] - Specify how arguments are sent to the logging method (can be `simple` or `object`)
 * @property {String} [source='source'] - Specify property name that will be used for the `source` value.
 * @property {String} [name='name'] - Specify property name that will be used for the `name` value.
 * @property {String} [args='args'] - Specify property name that will be used for the `args` value.
 * @property {Boolean} [argsAsObject=false] - Specify if you want function arguments to be logged as object
 */

/**
 * Plugin Settings
 *
 * @typedef {Object} PluginConfigObj
 * @property {String} [sourceMatcher] - regular expression for source matching
 * @property {String} [sourceExcludeMatcher] - regular expression for exclude source matching
 * @property {LoggerDataObj} [loggingData] - object with logging data
 * @property {PluginConfigOutput} [output] - object with logging data
 */

/**
 * Plugin known data that is sent as parameter
 *
 * @typedef {Object} LogResourceObj
 * @property {Number} column - column number where the source code is located
 * @property {Number} line - line number where the source code is located
 * @property {String} name - name (usually the function name)
 * @property {String} source - file name, may including path
 */
