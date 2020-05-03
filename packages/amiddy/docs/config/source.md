# source
Source server, usually is your local server.


## source.ip

- Data type: String
- Required: No
- Default value: `127.0.0.1`
- Example value:
    - `192.168.10.2`
    - `127.100.5.24`
- Details:
    - Specify the IP that will be used to request resources if there is no match from dependencies.


## source.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `false`
    - `true`
- Details:
    - Specify if the source uses secure protocol.


## source.port

- Data type: Number
- Required: No
- Default value: `3000`
- Example value:
    - `80`
    - `8080`
    - `1080`
- Details:
    - Specify port for the source.
