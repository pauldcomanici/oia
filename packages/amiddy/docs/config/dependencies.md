# deps
Array that has one or more objects where each object represents a dependency.
Every dependency should have patters that will resolve.


## dependency.ip

- Data type: String
- Required: Yes if [dependency.name](#dependencyname) does not have value
- Default value: N/A
- Example value: `127.1.2.3`
- Details:
    - IP for the dependency.


## dependency.name

- Data type: String
- Required: Yes if [dependency.ip](#dependencyip) does not have value
- Default value: N/A
- Example value:
    - `domain.com`
    - `sub.domain.com`
- Details:
    - Host name for the dependency.
    - If [dependency.ip](#dependencyip) is set this value is ignored


## dependency.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `true`
    - `false`
- Details:
    - Specify if the dependency uses secure protocol.


## dependency.port

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


### dependency.patterns

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
    - For the pattern testing [micromatch.isMatch](https://www.npmjs.com/package/micromatch#ismatch) is used having as options `{contains: true}`


### dependency.mocks

- Data type: Array<Object>
- Required: No
- Default value: N/A
- Example value:
    - ```json
      [
        {
          "patterns": ["/info**"],
          "response": {"backup":  "if we fail to get fixture content"},
          "status": 206,
          "fixture": "__local__/info.txt"
        }
      ]
      ```
    - ```json
      [
        {
          "methods": ["GET", "POST"],
          "patterns": ["/exact-path", "/user/**"],
          "response": {"notes": "for specified patterns at GET or POST respond with this and status code 200"}
        }
      ]
      ```
- Details:
    - Specify mocks for this dependency.


#### dependency.mocks.patterns

- Data type: Array<String>
- Required: Yes
- Default value: N/A
- Example value:
    - ```text/plain
      "patterns": ["/exact-path", "/user/**"],
      ```
    - ```text/plain
      "patterns": ["/info**"],
      ```
- Details:
    - Specify the pattern for request url to mock.
    - For the pattern testing [micromatch.isMatch](https://www.npmjs.com/package/micromatch#ismatch) is used having as options `{contains: true}`


#### dependency.mocks.methods

- Data type: Array<String>
- Required: No
- Default value: N/A
- Example value:
    - ```text/plain
      "methods": ["GET", "POST"],
      ```
    - ```text/plain
      "methods": ["PATCH"],
      ```
- Details:
    - Specify what method or methods should be mocked for the patterns.
    - Accept all methods if it is not specified.


#### dependency.mocks.status

- Data type: Any
- Required: No
- Default value: 200
- Example value:
    - ```text/plain
      "status": 200,
      ```
    - ```text/plain
      "status": 404,
      ```
- Details:
    - Specify mocked response status code.
    - Returns status code 200 when is not specified.


#### dependency.mocks.response

- Data type: Any
- Required: No
- Default value: '' (empty string)
- Example value:
    - ```text/plain
      "response": {"prop": "json response"},
      ```
    - ```text/plain
      "response": "text response",
      ```
    - ```text/plain
      "response": "{prop: 'json response as string'}",
      ```
- Details:
    - Specify mocked response body.


#### dependency.mocks.fixture

- Data type: String
- Required: No
- Default value: N/A
- Example value:
    - ```text/plain
      "fixture": "relative/path/to/file",
      ```
- Details:
    - Specify the relative path to the file that contains the response body.
    - If file content can be read it overwrites the value from `response`.


#### dependency.mocks.headers

- Data type: Object
- Required: No
- Default value: N/A
- Example value:
    - ```text/plain
      "headers": {
        "X-header": "this header will appear on the response",
        "X-header-mock": "also this header will appear on the response",
      },
      ```
- Details:
    - Headers that should be added to the response.
    - If the same header also exist on `proxy.response.headers` the value from here will be used.


