
import * as types from '@babel/types';

// constants
import consts from './constants';

/**
 * Utils service for logging arguments.
 *
 * @private
 * @mixin
 */
const privateApi = {};

/**
 * Utils service for logging arguments sent to logger
 *
 * @mixin
 */
const service = {};

/**
 * Get default arguments for logging
 *
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array<String>} parameter names that represent a string
 */
privateApi.getDefault = (knownData) => {
  // build first argument, will contain file name, line number and column number
  const firstArg = `[${knownData.source}:${knownData.line}:${knownData.column}]`;

  return [
    types.stringLiteral(firstArg),
    types.stringLiteral(knownData.name),
  ];
};

/**
 * Get function arguments that represent an Identifier
 *
 * @param {Object} path - node path
 * @return {Array<String>} parameter names that represent an Identifier
 */
privateApi.getFunctionArguments = (path) => {
  const {
    node: {
      params = [],
    } = {},
  } = path;

  return params
    .filter((param) => (types.isIdentifier(param)))
    .map((param) => (param.name));
};

/**
 * Get other arguments that should be added when logging, that are from the function call.
 *
 * @param {Object} path - node path
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array<String>} parameter names that represent an Identifier
 */
privateApi.getFunction = (path, knownData) => {

  const argumentsToAdd = [];

  const isCatchClause = types.isCatchClause(path);

  if (isCatchClause) {
    // for the catch we need to add the exception
    argumentsToAdd.push(path.node.param.name);
  } else if (knownData.name === consts.MEMBER_EXPRESSION_CATCH) {
    // for a member expression that is catch we should add his arguments
    argumentsToAdd.push(...privateApi.getFunctionArguments(path));
  }

  return argumentsToAdd.map((identifierName) => (types.identifier(identifierName)));
};

/**
 * Get value arguments when logging output is object
 *
 * @param {Object} state
 * @param {Array} otherArgs
 * @returns {ArrayExpression|ObjectExpression}
 */
privateApi.getArgsForObject = (state, otherArgs) => {
  const {
    argsAsObject,
  } = state.babelPluginLoggerSettings.output;

  if (otherArgs.length === 0) {
    return undefined;
  }

  if (argsAsObject) {
    const objectProperties = otherArgs.map(
      (otherArgIdentifier) => (
        types.objectProperty(
          otherArgIdentifier,
          otherArgIdentifier
        )
      )
    );
    return types.objectExpression(objectProperties);
  }

  return types.arrayExpression(
    otherArgs
  );
};

/**
 * Get arguments when output has as type `object`
 *
 * @param {Object} state
 * @param {Array} defaultArgs
 * @param {Array} otherArgs
 * @returns {Array<ObjectExpression>}
 */
privateApi.getForObject = (state, defaultArgs, otherArgs) => {
  const {
    source,
    name,
    args,
  } = state.babelPluginLoggerSettings.output;
  const objectProperties = [
    types.objectProperty(
      types.identifier(source),
      defaultArgs[0]
    ),
    types.objectProperty(
      types.identifier(name),
      defaultArgs[1]
    ),
  ];

  const argsForObject = privateApi.getArgsForObject(state, otherArgs);
  if (argsForObject) {
    // add arguments only if they exist
    objectProperties.push(
      types.objectProperty(
        types.identifier(args),
        argsForObject
      )
    )
  }

  return [
    types.objectExpression(
      objectProperties
    ),
  ];
};

/**
 * Get arguments for the logger call that is inserted.
 *
 * @param {Object} path - node path
 * @param {Object} state - node state
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array} args
 */
service.get = (path, state, knownData) => {
  const {
    type,
  } = state.babelPluginLoggerSettings.output;

  const defaultArgs = privateApi.getDefault(knownData);
  const otherArgs = privateApi.getFunction(path, knownData);

  if (type === 'object') {
    return privateApi.getForObject(state, defaultArgs, otherArgs);
  }

  // by default use simple output
  return defaultArgs.concat(otherArgs);
};

// only for testing
export {
  privateApi,
};

export default service;
