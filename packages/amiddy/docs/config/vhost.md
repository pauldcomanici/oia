# vhost
vhost to use.


## vhost.name

- Data type: String
- Required: Yes
- Default value: `example.com`
- Example value:
    - `github.com`
    - `pauldcomanici.github.com`
- Details:
    - Specify the vhostname.


## vhost.https

- Data type: Boolean
- Required: No
- Default value: `false`
- Example value:
    - `false`
    - `true`
- Details:
    - Specify if the vhost uses secure protocol.
    - When is set to `true`, it will try to use [sslFiles](sslFiles.md) and if they are not provided will use [selfsigned](selfsigned.md) certificate.


## vhost.port

- Data type: Number
- Required: No
- Default value: `3000`
- Example value:
    - `80`
    - `8080`
    - `1080`
- Details:
    - Specify port for the vhost.
