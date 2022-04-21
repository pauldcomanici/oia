
import * as types from '@babel/types';

// constants
import consts from './constants.js';

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
 * @return {Array<StringLiteral>} parameter names that represent a string
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
 * @param {Object} state - node state
 * @param {LogResourceObj} knownData - object with pre-determined data
 * @return {Array<Identifier|ObjectExpression>} parameter names that represent an Identifier
 */
privateApi.getFunction = (path, state, knownData) => {
  const {
    argsAsObject,
  } = state.babelPluginLoggerSettings.output;

  const argumentsToAdd = [];

  const isCatchClause = types.isCatchClause(path);

  if (isCatchClause) {
    if (path.node.param) {
      // for the catch we need to add the exception only if it is used
      argumentsToAdd.push(path.node.param.name);
    }
  } else if (knownData.name === consts.MEMBER_EXPRESSION_CATCH) {
    // for a member expression that is catch we should add his arguments
    argumentsToAdd.push(...privateApi.getFunctionArguments(path));
  }

  const identifierArgs = argumentsToAdd.map(
    (identifierName) => {
      const argIdentifierKey = types.stringLiteral(identifierName);
      const argIdentifier = types.identifier(identifierName);

      if (argsAsObject) {
        return types.objectProperty(
          argIdentifierKey,
          argIdentifier
        );
      }

      return argIdentifier;
    }
  );

  if (argsAsObject) {
    if (identifierArgs.length) {
      return [types.objectExpression(identifierArgs)];
    }

    return [];
  }

  return identifierArgs;
};

/**
 * Get value arguments when logging output is object
 *
 * @param {Object} state
 * @param {Array} fnArgs
 * @return {ArrayExpression|ObjectExpression}
 */
privateApi.getArgsForObject = (state, fnArgs) => {
  const {
    argsAsObject,
  } = state.babelPluginLoggerSettings.output;

  if (fnArgs.length === 0) {
    return undefined;
  }

  if (argsAsObject) {
    return fnArgs[0];
  }

  return types.arrayExpression(
    fnArgs
  );
};

/**
 * Get arguments when output has as type `object`
 *
 * @param {Object} state
 * @param {Array<StringLiteral>} defaultArgs
 * @param {Array<Identifier|ObjectExpression>} fnArgs
 * @return {Array<ObjectExpression>}
 */
privateApi.getForObject = (state, defaultArgs, fnArgs) => {
  const {
    source,
    name,
    args,
  } = state.babelPluginLoggerSettings.output;
  const objectProperties = [
    types.objectProperty(
      types.stringLiteral(source),
      defaultArgs[0]
    ),
    types.objectProperty(
      types.stringLiteral(name),
      defaultArgs[1]
    ),
  ];

  const argsForObject = privateApi.getArgsForObject(state, fnArgs);
  if (argsForObject) {
    // add arguments only if they exist
    objectProperties.push(
      types.objectProperty(
        types.stringLiteral(args),
        argsForObject
      )
    );
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
  const fnArgs = privateApi.getFunction(path, state, knownData);

  if (type === 'object') {
    return privateApi.getForObject(state, defaultArgs, fnArgs);
  }

  // by default use simple output
  return defaultArgs.concat(fnArgs);
};

// only for testing
export {
  privateApi,
};

export default service;
