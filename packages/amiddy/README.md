<p align="center">
  <a href="https://travis-ci.org/darkyndy/amiddy">
    <img
      alt="Travis Status"
      src="https://travis-ci.org/darkyndy/amiddy.svg?branch=master"
    />
  </a>
  <a href="https://codecov.io/gh/darkyndy/amiddy">
    <img
      alt="Coverage Status"
      src="https://codecov.io/gh/darkyndy/amiddy/branch/master/graph/badge.svg"
    />
  </a>
  <a href="https://snyk.io/test/github/darkyndy/amiddy?targetFile=package.json">
    <img
      alt="Known Vulnerabilities"
      src="https://snyk.io/test/github/darkyndy/amiddy/badge.svg?targetFile=package.json"
      data-canonical-src="https://snyk.io/test/github/darkyndy/amiddy?targetFile=package.json"
      style="max-width:100%;"
    />
  </a>
  <a href="https://david-dm.org/darkyndy/amiddy">
    <img
      alt="dependencies status"
      src="https://david-dm.org/darkyndy/amiddy/status.svg"
    />
  </a>
  <a href="https://david-dm.org/darkyndy/amiddy?type=dev">
    <img
      alt="devDependencies status"
      src="https://david-dm.org/darkyndy/amiddy/dev-status.svg"
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
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fdarkyndy%2Famiddy?ref=badge_shield">
    <img
      alt="FOSSA Status"
      src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdarkyndy%2Famiddy.svg?type=shield"
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
You just need to create a file with this name, complete [json configuration](#options) and you can start the server.  

### Via CLI
Using `--config` or `-c` arguments you can provide path to the configuration file.
Example: `npm run start-amiddy --config=../path/to/file.json`

### Options
Abstract example:
```json
{
  "deps": [
    {
      "ip": "127.0.0.2",
      "https": false,
      "port": 80,
      "patterns": [
        "/images/**"
      ]
    },
    {
      "name": "example.com",
      "https": false,
      "port": 8080,
      "patterns": [
        "/api/**"
      ]
    }
  ],
  "selfsigned": {
    "attrs": [
      {
        "name": "commonName",
        "value": "example.com"
      }
    ],
    "opts": {
      "days": 365
    }
  },
  "source": {
    "ip": "127.0.0.1",
    "https": false,
    "port": 80
  },
  "proxy": {
    "changeOrigin": false,
    "ws": true
  },
  "vhost": {
    "name": "example.com",
    "https": false,
    "port": 80
  }
}
```


#### deps
Array that has one or more objects where each object represents a dependency.
Every dependency should have patters that will resolve.


#### dependency.ip

- Data type: String
- Required: Yes if [dependency.name](#dependencyname) does not have value
- Default value: N/A
- Example value: `127.1.2.3`
- Details:
    - IP for the dependency.


#### dependency.name

- Data type: String
- Required: Yes if [dependency.ip](#dependencyip) does not have value
- Default value: N/A
- Example value:
    - `domain.com`
    - `sub.domain.com`
- Details:
    - Host name for the dependency.
    - If [dependency.ip](#dependencyip) is set this value is ignored (TODO: I want?!)


#### dependency.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `true`
    - `false`
- Details:
    - Specify if the dependency uses secure protocol.


#### dependency.port

- Data type: Number
- Required: No
- Default value:
    - `80` if [dependency.https](#dependencyhttps) has falsy value
    - `443` if [dependency.https](#dependencyhttps) has `true` as value
- Example value:
    - `3000`
    - `8080`
- Details:
    - Specify port for the dependency.


#### dependency.patterns

- Data type: Array<String>
- Required: Yes
- Default value: N/A
- Example value:
    - ```json
      [
        "/api/**"
      ]
      ```
    - ```json
      [
        "/test/**",
        "/api/*",
        "/logout"
      ]
      ```
- Details:
    - Specify patterns that if they match will use proxy the request to this dependency.
    - Patterns are tested using [micromatch.isMatch](https://www.npmjs.com/package/micromatch#ismatch) having as options `{contains: true}`



#### source
Source server, usually is your local server.


#### source.ip

- Data type: String
- Required: No
- Default value: `127.0.0.1`
- Example value:
    - `192.168.10.2`
    - `127.100.5.24`
- Details:
    - Specify the IP that will be used to request resources if there is no match from dependencies.


#### source.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `false`
    - `true`
- Details:
    - Specify if the source uses secure protocol.


#### source.port

- Data type: Number
- Required: No
- Default value: `3000`
- Example value:
    - `80`
    - `8080`
    - `1080`
- Details:
    - Specify port for the source.



#### proxy
Proxy configuration.

For complete list of options see [http-proxy#options](https://www.npmjs.com/package/http-proxy#options)

> Note: ssl option is not yet supported.



#### vhost
vhost to use.


#### vhost.name

- Data type: String
- Required: Yes
- Default value: `example.com`
- Example value:
    - `github.com`
    - `darkyndy.github.com`
- Details:
    - Specify the vhostname.


#### vhost.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `false`
    - `true`
- Details:
    - Specify if the vhost uses secure protocol.


#### vhost.port

- Data type: Number
- Required: No
- Default value: `3000`
- Example value:
    - `80`
    - `8080`
    - `1080`
- Details:
    - Specify port for the vhost.



### selfsigned
Options to generate selfsigned certificate.


#### selfsigned.attrs
Please refer to: [https://github.com/digitalbazaar/forge/blob/0.7.5/lib/x509.js#L129](https://github.com/digitalbazaar/forge/blob/0.7.5/lib/x509.js#L129)


#### selfsigned.opts
Please refer to [selfsigned#options](https://github.com/jfromaniello/selfsigned#options)



## Command Line Options

### `--config`, `-c`
Allows you to set the configuration file.

### `--debug`, `-d`
Allows you to see debug logs. Useful to see what is the configuration that was loaded.

## License

The MIT License (MIT)


