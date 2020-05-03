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
    - Patterns are tested using [micromatch.isMatch](https://www.npmjs.com/package/micromatch#ismatch) having as options `{contains: true}`

