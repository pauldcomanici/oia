
# options
Amiddy options.


## options.recorder
Options for recorder.


### options.recorder.enabled
- Data type: Boolean
- Required: No
- Default value: false
- Details:
    - Specify if you want to record every response from dependencies


### options.recorder.fileNamePattern
- Data type: String
- Required: No
- Default value: '{METHOD}-{PATH}.{EXT}'
- Details:
    - File name based on tokens where to save the response.
    - Available tokens are: `METHOD`, `PATH`, `EXT` and `STATUS`
    - To determine extension [npm mime-types](https://www.npmjs.com/package/mime-types) is used


### options.recorder.ignorePatterns
- Data type: Array<String>
- Required: No
- Default value: []
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
    - Specify patterns that if they match will not save the response.
    - For the pattern testing [micromatch.isMatch](https://www.npmjs.com/package/micromatch#ismatch) is used having as options `{contains: true}`


### options.recorder.path
- Data type: String
- Required: No
- Default value: '__amiddy__/records'
- Details:
    - Folder where to save responses.
