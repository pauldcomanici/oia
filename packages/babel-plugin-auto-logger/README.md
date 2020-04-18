<p align="center">
  <a href="https://github.com/darkyndy/oia/tree/master/packages/babel-plugin-auto-logger">
    <img
      alt="CI Status"
      src="https://github.com/darkyndy/oia/workflows/CI/badge.svg"
    />
  </a>
  <a href="https://codecov.io/gh/darkyndy/oia/tree/master/packages/babel-plugin-auto-logger/src">
    <img
      alt="Coverage Status"
      src="https://codecov.io/gh/darkyndy/oia/branch/master/graph/badge.svg?flags=babel-plugin-auto-logger"
    />
  </a>
  <a href="https://snyk.io/test/github/darkyndy/oia?targetFile=packages/babel-plugin-auto-logger/package.json">
    <img
      alt="Known Vulnerabilities"
      src="https://snyk.io/test/github/darkyndy/oia/badge.svg?targetFile=packages/babel-plugin-auto-logger/package.json"
      data-canonical-src="https://snyk.io/test/github/darkyndy/oia/badge.svg?targetFile=packages/babel-plugin-auto-logger/package.json"
      style="max-width:100%;"
    />
  </a>
  <a href="https://www.npmjs.com/package/babel-plugin-auto-logger">
    <img
      alt="npm Downloads"
      src="https://img.shields.io/npm/dm/babel-plugin-auto-logger.svg?maxAge=57600"
    />
  </a>
  <a href="https://github.com/darkyndy/babel-plugin-auto-logger/blob/master/LICENSE">
    <img
      alt="MIT License"
      src="https://img.shields.io/npm/l/babel-plugin-auto-logger.svg"
    />
  </a>
  <br/>
  <a href="https://www.patreon.com/paul_comanici">
    <img
      alt="support the author"
      src="https://img.shields.io/badge/patreon-support%20the%20author-blue.svg"
    />
  </a>
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=T645WN5RWR6WS&source=url">
    <img
      alt="donate"
      src="https://img.shields.io/badge/paypal-donate-blue.svg"
    />
  </a>
</p>

# babel-plugin-auto-logger
Babel Plugin that will automatically add logging to your existing JS code.

Are you tired of adding logging calls over and over again?
This plugin will automatically do it for you.

There are 2 use-cases covered by default:
1. logging error
    - uses `error` method
    - for [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
    - for [Promise.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
2. logging verbose
    - uses `log` method
    - every case that is does not log error and is not an arrow function that has only return

## Installation
```sh
npm install --save-dev babel-plugin-auto-logger
```
Or if you are using [yarn](https://yarnpkg.com/en/)
```sh
yarn add --dev babel-plugin-auto-logger
```

## Usage

### Via `.babelrc` (Recommended)
```json
{
  "plugins": ["babel-plugin-auto-logger"]
}
```

### Via CLI
```sh
node node_modules/.bin/babel --plugins babel-plugin-auto-logger script.js
```

### Via Node API
```javascript
require("@babel/core").transform("code", {
  plugins: ["babel-plugin-auto-logger"]
});
```

## Configuration - Advanced usage scenarios
Bellow examples are for `.babelrc`, [read more...](https://babeljs.io/docs/en/plugins/#plugin-options)

### Options
Abstract example with all plugin options:
```json
{
  "loggingData": {
    "levelForTryCatch": "error",
    "levelForMemberExpressionCatch": "error",
    "levels": {
      "debug": {
        "matchFunctionName": "^(get|set)$",
        "matchSource": "utils.js$",
        "methodName": "myDebug"
      },
      "error": {
        "methodName": "myError"
      },
      "info": {
        "matchFunctionName": "adapt",
        "matchSource": "api.js$",
        "methodName": "myInfo"
      },
      "log": {
        "matchSource": "",
        "methodName": "myLog"
      },
      "warn": {
        "matchFunctionName": "matcher-for-function-name",
        "matchSource": "matcher-for-source",
        "methodName": "myWarn"
      }
    },
    "name": "myLogger",
    "source": "path/to/file"
  },
  "output": {
    "argsAsObject": true,
    "args": "argsParam",
    "name": "nameParam",
    "source": "sourceParam",
    "type": "object"
  },
  "sourceMatcher": "RegExp",
  "sourceExcludeMatcher": "RegExp"
}
```

#### loggingData
- Data type: Object
- Default value: see bellow for every property.
- Details:
  - Define how logging will be added, service name, method names and when they will apply.

##### loggingData.levelForTryCatch
- Data type: String
- Default value: `error`
- Details:
  - controls what log level will be used inside the catch block

##### loggingData.levelForMemberExpressionCatch
- Data type: String
- Default value: `error`
- Details:
  - controls what log level will be used inside the block for catch that is a member of an expression (e.g. Promise.catch())

##### loggingData.levels
- Data type: Object
- Default value:
  ```text
  {
    debug: {
      matchFunctionName: '',
      matchSource: '',
      methodName: 'debug',
    },
    error: {
      methodName: 'error',
    },
    info: {
      matchFunctionName: '',
      matchSource: '',
      methodName: 'info',
    },
    log: {
      matchFunctionName: '',
      matchSource: '',
      methodName: 'log',
    },
    warn: {
      matchFunctionName: '',
      matchSource: '',
      methodName: 'warn',
    },
  }
  ```
- Details:
  - logging levels are based on [console API](https://developer.mozilla.org/en-US/docs/Web/API/console)
    - debug
    - error
    - info
    - log
    - warn
  - allows you to use your own method names for logging API
    > Tip: If you want all logging levels to use same method, just set same value for `methodName`


###### loggingData.levels.logLevel
- Data type: Object
- Default value: specific for every log level
- Details:
  - allows to use your own method name for logging API
  - ability to control when this log level will be used (only for warn, info & debug) based on regular expression that tests source or function name

##### loggingData.name
- Data type: String
- Default value: `'console'`
- Details:
  - usually used in combination with `loggingData.source`
  - represents the name for default import if `loggingData.source` has truthy value or the name of a service that is globally available

##### loggingData.source
- Data type: String
- Default value: `''` (empty string)
- Details:
  - usually used in combination with `loggingData.name`
  - when it has truthy value it can represent the path or the npm package name to the service that will be imported


#### output
- Data type: Object
- Default value: `{type: 'simple'}`
- Details:
  - Specify how arguments are provided to the logging function.

##### output.type
- Data type: String
- Default value: `'simple'`
- Details:
  - Specify how arguments are provided to the logging function. As one arguments (object) or multiple arguments.
  - When value is not valid will use the default value.


###### output.type == 'simple'
When value is `'simple'` will provide multiple arguments to the logging function, example:
```js
logger.info('[file-path/input.js:16:19]', 'function-name', anotherArg, andOtherArg);
```

###### output.type == 'object'
When value is `'object'` will provide one argument to the logging function, example:
```js
logger.info({
  source: '[file-path/input.js:16:19]',
  name: 'function-name',
  args: [
    anotherArg,
    andOtherArg,
  ],
});
```

You can also configure the name for the `source`, `name` and `args`.
For example having setting as:
```json
{
  "output": {
    "type": "object",
    "argsAsObject": false,
    "source": "sourceParam",
    "name": "nameParam",
    "args": "argsParam"
  }
}
```
will result in the following code generated for logging:
```js
logger.info({
  sourceParam: '[file-path/input.js:16:19]',
  nameParam: 'function-name',
  argsParam: [
    anotherArg,
    andOtherArg,
  ],
});

```

And when you set `"argsAsObject": true,` will result in:

```js
logger.info({
  sourceParam: '[file-path/input.js:16:19]',
  nameParam: 'function-name',
  argsParam: {
    anotherArg: anotherArg,
    andOtherArg: andOtherArg,
  },
});

```


#### sourceMatcher
- Data type: String or Array of Strings
- Default value:
  ```text
  [
    '.*js(x)?$',
  ]
  ```
  source file is any file that ends in `js` or `jsx` (e.g.: `utils.js`, `view.jsx`)
- Details:
  - allows you to configure what will be considered as source code
  - every String represents a RegExp

#### sourceExcludeMatcher
- Data type: String or Array of Strings
- Default value:
  ```text
  [
    '__fixtures__',
    '__mocks__',
    '__tests__',
    '__snapshots__',
    'node_modules',
  ]
  ```
  files that will be excluded are the ones that contain in the path above strings
- Details:
  - allows you to configure what will be excluded from source code
  - every String represents a RegExp
  - if the pattern matches both the inclusion and exclusion then the pattern will be excluded


### Use-cases / examples

You can check [E2E tests](__e2e__/fixtures) for possible examples that are used in testing.
For every folder you will see:
  - `options.json` (plugin configuration)
  - `input.js` (source code)
  - `output.js` (output code)


#### Disable generation of default verbose logging
By default the plugin will log every non exception/promise rejection using verbose logging (`log` method).
If you want to disable it, here is an example configuration:
```json
{
  "plugins": [
    [
      "babel-plugin-auto-logger",
      {
        "levels": {
          "log": {
            "matchSource": "hopefully-there-is-no-file-name-with-this-name"
          }
        }
      }
    ]
  ]
}
```


#### Control logging API
By default plugin will insert logs based on [console API](https://developer.mozilla.org/en-US/docs/Web/API/console)

If you want to control the API (service) that should be used, you will use `name` property from `loggingData` object. Example:
```json
{
  "plugins": [
    [
      "babel-plugin-auto-logger",
      {
        "loggingData": {
          "name": "myLogger",
          "source": "path/to/file"
        }
      }
    ]
  ]
}
```
> Based on above config, code that exists under path `src/code.js`:
>  ```javascript
>  function x(a, b) {
>    return a + b;
>  }
>  ```
>  will become:
>  ```javascript
>  import myLogger from "path/to/file";
>   
>  function x(a, b) {
>    myLogger.log("[src/code.js:1:17]", "x");
>    return a + b;
>  }
>  ```

