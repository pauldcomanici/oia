<p align="center">
  <a href="https://github.com/darkyndy/oia/tree/master/packages/amiddy">
    <img
      alt="CI Status"
      src="https://github.com/darkyndy/oia/workflows/CI/badge.svg"
    />
  </a>
  <a href="https://codecov.io/gh/darkyndy/oia/tree/master/packages/amiddy/src">
    <img
      alt="Coverage Status"
      src="https://codecov.io/gh/darkyndy/oia/branch/master/graph/badge.svg?flags=amiddy"
    />
  </a>
  <a href="https://snyk.io/test/github/darkyndy/oia?targetFile=packages/amiddy/package.json">
    <img
      alt="Known Vulnerabilities"
      src="https://snyk.io/test/github/darkyndy/oia/badge.svg?targetFile=packages/amiddy/package.json"
      data-canonical-src="https://snyk.io/test/github/darkyndy/oia/badge.svg?targetFile=packages/amiddy/package.json"
      style="max-width:100%;"
    />
  </a>
  <a href="https://www.npmjs.com/package/amiddy">
    <img
      alt="npm Downloads"
      src="https://img.shields.io/npm/dm/amiddy.svg?maxAge=57600"
    />
  </a>
  <a href="https://github.com/darkyndy/amiddy/blob/master/LICENSE">
    <img
      alt="MIT License"
      src="https://img.shields.io/npm/l/amiddy.svg"
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


# amiddy
Middleware package that makes development much simpler.


## Key features
1. proxy any dependency based on pattern matcher (fallback to source)
2. mock dependency responses
3. record dependency response


## Installation
```sh
npm install --save-dev amiddy
```
Or if you are using [yarn](https://yarnpkg.com/en/)
```sh
yarn add --dev amiddy
```


## Usage
Add new script in `package.json`. Example:
```
"scripts": {
  "start-amiddy": "node amiddy"
}
```
After that start the server by running `npm run start-amiddy`


## Configuration

### Via `.amiddy` (Recommended)
You need to have at project root folder a file named `.amiddy` that contains valid json.
Create a file with this name, complete [json configuration](#options) and you can start the server.

### Via CLI
Using `--config` or `-c` arguments you can provide the path to the configuration file.
Example: `npm run start-amiddy --config=../path/to/file.json`

### Options
See [docs/config/README.md](https://github.com/darkyndy/oia/blob/master/packages/amiddy/docs/config/README.md)


## Command Line Options

### `--config`, `-c`
Allows you to set the configuration file.

### `--tokens`, `-t`
Allows you to set the tokens file.
When using tokens file, the config file will be used as base configuration, see [#16](https://github.com/darkyndy/oia/issues/16).

### `--debug`, `-d`
Allows you to see debug logs. Useful to see what is the configuration that was loaded.

## License

The MIT License (MIT)


