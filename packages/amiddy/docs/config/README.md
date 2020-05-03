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
  }
}
```

## deps
See [dependencies.md](dependencies.md)


#### selfsigned
See [selfsigned.md](selfsigned.md)


## source
See [source.md](source.md)


## proxy
See [proxy.md](proxy.md)


#### vhost
See [vhost.md](vhost.md)

