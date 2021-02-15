# Configuration

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
      ],
      "mocks": [
        {
          "patterns": ["/info**"],
          "response": {"backup":  "if we fail to get fixture content"},
          "status": 206,
          "fixture": "__local__/info.txt"
        },
        {
          "methods": ["GET", "POST"],
          "patterns": ["/exact-path", "/user/**"],
          "response": {"notes": "for specified patterns at GET or POST respond with this and status code 200"}
        },
        {
          "disabled": true,
          "patterns": ["/company**"],
          "response": {"notes": "disabled for the moment"},
          "headers": {
            "X-Mock": "header for the response"
          }
        },
        {
          "patterns": ["/company**"],
          "response": {"notes": "this adds extra headers on the response"},
          "headers": {
            "X-Mock": "header for the response"
          }
        }
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
  "sslFiles": {
    "cert": "path/to/cert.crt",
    "key": "path/to/cert.key"
  },
  "source": {
    "ip": "127.0.0.1",
    "https": false,
    "port": 80
  },
  "proxy": {
    "options": {
      "changeOrigin": false,
      "ws": true
    },
    "response": {
      "headers": {
        "X-Special-Proxy-Header": "on-response"
      }
    }
  },
  "vhost": {
    "name": "example.com",
    "https": false,
    "port": 80
  },
  "options": {
    "mock": {
      "enabled": true
    },
    "recorder": {
      "enabled": true,
      "fileNamePattern": "{METHOD}-{PATH}.{EXT}",
      "ignorePatterns": [
        "**favicon*"
      ],
      "path": "__local__/records"
    }
  }
}
```

## deps
See [dependencies.md](dependencies.md)


#### selfsigned
See [selfsigned.md](selfsigned.md)


#### sslFiles
See [sslFiles.md](sslFiles.md)


## source
See [source.md](source.md)


## proxy
See [proxy.md](proxy.md)


#### vhost
See [vhost.md](vhost.md)


#### options
See [options.md](options.md)

