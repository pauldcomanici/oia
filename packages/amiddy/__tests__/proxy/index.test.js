
import httpProxy from 'http-proxy';
// import vhost from 'vhost'; // Note: vhost is a function and for this case we are using real implementation

// testing file
import proxy, {privateApi} from '../../src/proxy';


import proxyMock from '../../src/proxy/mock';
import proxyListen from '../../src/proxy/listen';
import proxyUtils from '../../src/proxy/utils';


// mocks
jest.mock('http-proxy', () => (
  {
    createProxyServer: jest.fn().mockReturnValue(
      {
        on: jest.fn(),
        proxyRequest: jest.fn(),
      }
    ),
  }
));
// jest.mock('vhost', () => 'vhost');

jest.mock('../../src/proxy/mock', () => (
  {
    execute: jest.fn().mockReturnValue(false),
  }
));
jest.mock('../../src/proxy/listen', () => (
  {
    error: jest.fn(),
    request: jest.fn(),
    response: jest.fn(),
  }
));
jest.mock('../../src/proxy/utils', () => (
  {
    buildUrl: jest.fn().mockReturnValue('proxyUtils::buildUrl'),
    extendOptions: jest.fn(),
    getDependency: jest.fn().mockReturnValue('proxyUtils::getDependency'),
  }
));


describe('proxy', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getResponseOptions', () => {
    beforeEach(() => {
      testSpecificMocks.config = {
        proxy: {
          response: {
            headers: {
              'X-Special-Proxy-Header': 'on-response',
            }
          }
        }
      };

      testSpecificMocks.responseStructure = {
        headers: {},
      };
    });

    it('returns object with proxy response options, having response headers from config', () => {
      expect(
        privateApi.getResponseOptions(testSpecificMocks.config)
      ).toEqual({
        headers: {
          'X-Special-Proxy-Header': 'on-response',
        }
      });
    });

    it('returns object with proxy response options, having common structure as proxy config was not set', () => {
      expect(
        privateApi.getResponseOptions({})
      ).toEqual(
        testSpecificMocks.responseStructure
      );
    });

    it('returns object with proxy response options, having common structure as proxy response config was not set', () => {
      testSpecificMocks.config.proxy.response = {};

      expect(
        privateApi.getResponseOptions(testSpecificMocks.config)
      ).toEqual(
        testSpecificMocks.responseStructure
      );
    });

    it('returns object with proxy response options, having common structure as proxy response headers config was not set', () => {
      testSpecificMocks.config.proxy.response.headers = undefined;

      expect(
        privateApi.getResponseOptions(testSpecificMocks.config)
      ).toEqual(
        testSpecificMocks.responseStructure
      );
    });

  });

  describe('privateApi.vhostCb', () => {
    beforeEach(() => {
      testSpecificMocks.proxy = {
        proxyRequest: jest.fn(),
      };
      testSpecificMocks.ssl = {
        cert: 'cert',
      };
      testSpecificMocks.config = {
        deps: [
          {
            mocks: [
              {
                headers: {
                  'X-Mock-Accepted': 'mocked-header',
                },
                patterns: [
                  '**/endpoint/**',
                  '**/ping*',
                ],
                status: 202
              },
              {
                headers: {
                  'X-Mock_user_create': 'user-created',
                },
                methods: ['POST'],
                patterns: [
                  '**/user/*',
                ],
                status: 201
              },
              {
                methods: ['GET'],
                patterns: [
                  '**/user/*',
                ],
              },
            ],
            name: '127.0.0.2',
            patterns: [
              '/images/**',
            ],
            port: 3000,
          },
          {
            name: '127.0.0.1',
            patterns: [
              '/api/**',
            ],
            port: 8080,
          },
        ],
        proxy: {
          options: {
            ws: true,
          },
          response: {
            headers: {
              'X-Special-Proxy-Header': 'on-response',
            },
          },
        },
        source: {
          name: '127.0.0.1',
          port: 3000,
        },
        vhost: {
          name: 'http://github.com',
          port: 80,
        },
      };

      testSpecificMocks.req = {
        req: 'req',
        url: 'http://example.com/api/test',
      };
      testSpecificMocks.res = {
        res: 'res',
      };
    });

    afterEach(() => {
      proxyUtils.buildUrl.mockClear();
      proxyUtils.getDependency.mockClear();
      proxyUtils.extendOptions.mockClear();
      proxyMock.execute.mockClear();
      testSpecificMocks.proxy.proxyRequest.mockClear();
    });

    it('determines dependency that will act as proxy for the request', () => {
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyUtils.getDependency
      ).toHaveBeenCalledWith(
        testSpecificMocks.config.deps,
        testSpecificMocks.req.url,
      );
    });

    it('tries to respond with mock data (use-case: uses dependency determined)', () => {
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyMock.execute
      ).toHaveBeenCalledWith(
        testSpecificMocks.req,
        testSpecificMocks.res,
        'proxyUtils::getDependency',
        testSpecificMocks.config.proxy.response,
      );
    });

    it('tries to respond with mock data (use-case: uses source as dependency was not determined)', () => {
      proxyUtils.getDependency.mockReturnValueOnce(undefined);
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyMock.execute
      ).toHaveBeenCalledWith(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.config.source,
        testSpecificMocks.config.proxy.response,
      );
    });

    it('does not proxy the request if we have data to mock the response', () => {
      proxyMock.execute.mockReturnValueOnce(true);
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        testSpecificMocks.proxy.proxyRequest
      ).not.toHaveBeenCalled();
    });

    it('builds url from source that will be used for proxy options', () => {
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyUtils.buildUrl
      ).toHaveBeenCalledWith(
        testSpecificMocks.config.source
      );
    });

    it('uses default proxy options if the config for proxy did not had any option (response was not mocked)', () => {
      testSpecificMocks.config.proxy = {};
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyUtils.extendOptions
      ).toHaveBeenCalledWith(
        {
          changeOrigin: false,
          headers: {
            host: testSpecificMocks.config.vhost.name,
          },
          secure: false,
          target: 'proxyUtils::buildUrl',
          ws: false,
        },
        testSpecificMocks.ssl,
        'proxyUtils::getDependency',
      );
    });

    it('extends proxy options taking in consideration determined dependency (response was not mocked)', () => {
      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        proxyUtils.extendOptions
      ).toHaveBeenCalledWith(
        {
          changeOrigin: false,
          headers: {
            host: testSpecificMocks.config.vhost.name,
          },
          secure: false,
          target: 'proxyUtils::buildUrl',
          ws: true,
        },
        testSpecificMocks.ssl,
        'proxyUtils::getDependency',
      );
    });

    it('proxies the request (response was not mocked)', () => {
      testSpecificMocks.config.proxy.changeOrigin = false;
      testSpecificMocks.config.proxy.secure = false;

      privateApi.vhostCb(
        testSpecificMocks.proxy,
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      )(testSpecificMocks.req, testSpecificMocks.res);

      expect(
        testSpecificMocks.proxy.proxyRequest
      ).toHaveBeenCalledWith(
        testSpecificMocks.req,
        testSpecificMocks.res,
        {
          changeOrigin: false,
          headers: {
            host: testSpecificMocks.config.vhost.name,
          },
          secure: false,
          target: 'proxyUtils::buildUrl',
          ws: true,
        },
      );
    });

  });

  describe('create', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'vhostCb').mockReturnValue(
        () => 'vhost-cb'
      );
      jest.spyOn(privateApi, 'getResponseOptions').mockReturnValue(
        {
          headers: {},
        }
      );
    });
    beforeEach(() => {
      testSpecificMocks.ssl = {
        cert: 'cert',
      };
      testSpecificMocks.config = {
        deps: [
          {
            name: '127.0.0.2',
            patterns: [
              '/images/**',
            ],
            port: 3000,
          },
          {
            name: '127.0.0.1',
            patterns: [
              '/api/**',
            ],
            port: 8080,
          },
        ],
        proxy: {
          ws: true,
        },
        source: {
          name: '127.0.0.1',
          port: 3000,
        },
        vhost: {
          name: 'http://github.com',
          port: 80,
        },
      };

    });

    afterEach(() => {
      httpProxy.createProxyServer().on.mockClear();
      httpProxy.createProxyServer.mockClear();
      privateApi.getResponseOptions.mockClear();
      privateApi.vhostCb.mockClear();
    });
    afterAll(() => {
      privateApi.getResponseOptions.mockRestore();
      privateApi.vhostCb.mockRestore();
    });

    it('creates proxy server', () => {
      proxy.create(
        testSpecificMocks.config,
        testSpecificMocks.ssl,
      );

      expect(
        httpProxy.createProxyServer
      ).toHaveBeenCalledWith();
    });

    it('prepares options for the response', () => {
      proxy.create(
        testSpecificMocks.config,
        testSpecificMocks.ssl,
      );

      expect(
        privateApi.getResponseOptions
      ).toHaveBeenCalledWith(
        testSpecificMocks.config
      );
    });

    it('adds listener for `proxyReq`, `proxyRes` and `error` events', () => {
      proxy.create(
        testSpecificMocks.config,
        testSpecificMocks.ssl,
      );

      expect(
        httpProxy.createProxyServer().on.mock.calls
      ).toEqual(
        [
          [
            'proxyReq',
            proxyListen.request,
          ],
          [
            'proxyRes',
            proxyListen.response({}),
          ],
          [
            'error',
            proxyListen.error,
          ],
        ]
      );
    });

    it('prepares callback function for vhost', () => {
      proxy.create(
        testSpecificMocks.config,
        testSpecificMocks.ssl,
      );

      expect(
        privateApi.vhostCb
      ).toHaveBeenCalledWith(
        httpProxy.createProxyServer(),
        testSpecificMocks.ssl,
        testSpecificMocks.config,
      );
    });

  });

});
