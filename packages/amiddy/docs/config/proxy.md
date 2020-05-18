
# proxy
Proxy configuration.


## proxy.options
For complete list of options see [http-proxy#options](https://www.npmjs.com/package/http-proxy#options)

> Note: ssl option is not yet supported.

## proxy.response
Properties for the proxy when response is returned.

## proxy.response.headers

- Data type: Object
- Required: No
- Default value: N/A
- Example value:
    - ```json
      {
        "X-Mock": "header for the response"
      }
      ```
- Details:
    - Headers that should be added to the response.
