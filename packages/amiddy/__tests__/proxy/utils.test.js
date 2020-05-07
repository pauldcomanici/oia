
import url from 'url';

// testing file
import proxyUtils from '../../src/proxy/utils';

describe('proxy-utils', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('buildUrl', () => {
    beforeEach(() => {
      testSpecificMocks.options = {
        https: true,
        ip: '127.0.0.2',
        name: 'example.com',
        port: 3030,
      };
    });

    it('returns formatted url based on provided options (uses IP)', () => {
      expect(proxyUtils.buildUrl(testSpecificMocks.options))
        .toBe('https://127.0.0.2:3030');
    });

    it('returns formatted url based on provided options (uses name)', () => {
      testSpecificMocks.options.ip = undefined;
      testSpecificMocks.options.https = false;

      expect(proxyUtils.buildUrl(testSpecificMocks.options))
        .toBe('http://example.com:3030');
    });
  });

  describe('buildUrlObject', () => {
    beforeAll(() => {
      jest.spyOn(proxyUtils, 'buildUrl').mockReturnValue('formattedUrl');
      jest.spyOn(url, 'parse').mockReturnValue({
        host: 'example.com'
      });
    });
    beforeEach(() => {
      testSpecificMocks.options = {
        https: true,
        ip: '127.0.0.2',
        name: 'example.com',
        port: 3030,
      };
    });

    afterEach(() => {
      proxyUtils.buildUrl.mockClear();
      url.parse.mockClear();
    });
    afterAll(() => {
      proxyUtils.buildUrl.mockRestore();
      url.parse.mockRestore();
    });

    it('prepares formatted url based on provided options', () => {
      proxyUtils.buildUrlObject(testSpecificMocks.options);

      expect(
        proxyUtils.buildUrl
      ).toHaveBeenCalledWith(
        testSpecificMocks.options
      );
    });

    it('prepares parsed url based on formatted url', () => {
      proxyUtils.buildUrlObject(testSpecificMocks.options);

      expect(
        url.parse
      ).toHaveBeenCalledWith(
        proxyUtils.buildUrl()
      );
    });

    it('returns parsed url', () => {
      expect(
        proxyUtils.buildUrlObject(testSpecificMocks.options)
      ).toBe(
        url.parse()
      );
    });

  });

  describe('getDependency', () => {
    beforeEach(() => {
      testSpecificMocks.deps = [
        {
          name: '127.0.0.2',
          patterns: [
            '/no-match/**',
            '/hmm/**',
          ],
        },
        null,
        {
          name: '127.0.0.3',
        },
        {
          name: '127.0.0.4',
          patterns: [
            '/projects/*',
            '/idea/**',
          ],
        },
        {
          name: '127.0.0.5',
          patterns: [
            '/projects/**',
          ],
        },
      ];
      testSpecificMocks.reqUrl = 'https://darkyndy.com/projects/amiddy';
    });

    it('returns the first dependency that could resolve the request url if there is a pattern match', () => {
      expect(proxyUtils.getDependency(testSpecificMocks.deps, testSpecificMocks.reqUrl))
        .toEqual(
          testSpecificMocks.deps[3]
        );
    });


    it('returns undefined if there is no pattern match', () => {
      testSpecificMocks.reqUrl = 'https://darkyndy.com/project/amiddy';
      expect(proxyUtils.getDependency(testSpecificMocks.deps, testSpecificMocks.reqUrl))
        .toBe(
          undefined
        );
    });

  });

  describe('getMock', () => {
    beforeEach(() => {
      testSpecificMocks.mocks = [
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
        {
          patterns: [
            '**/users/*',
          ],
        },
        null,
        {
        },
      ];
      testSpecificMocks.reqUrl = 'https://example.com/api/user/?test=on';
      testSpecificMocks.method = 'GET';
    });

    it('returns object with the mock to be used when there is a match on method and url', () => {
      expect(
        proxyUtils.getMock(testSpecificMocks.mocks, testSpecificMocks.reqUrl, testSpecificMocks.method)
      )
        .toEqual(
          testSpecificMocks.mocks[2]
        );
    });

    it('returns object with the mock to be used when there is a match on url and all methods are allowed', () => {
      testSpecificMocks.reqUrl = 'https://example.com/api/users/?test=on';
      expect(
        proxyUtils.getMock(testSpecificMocks.mocks, testSpecificMocks.reqUrl, testSpecificMocks.method)
      )
        .toEqual(
          testSpecificMocks.mocks[3]
        );
    });

    it('returns object with the mock to be used when there is a match on method and url (multiple patterns)', () => {
      testSpecificMocks.reqUrl = 'https://example.com/api/endpoint';
      expect(
        proxyUtils.getMock(testSpecificMocks.mocks, testSpecificMocks.reqUrl, testSpecificMocks.method)
      )
        .toEqual(
          testSpecificMocks.mocks[0]
        );
    });

    it('returns undefined when there is no match', () => {
      testSpecificMocks.reqUrl = 'https://example.com/api/no-match';
      expect(
        proxyUtils.getMock(testSpecificMocks.mocks, testSpecificMocks.reqUrl, testSpecificMocks.method)
      )
        .toEqual(
          undefined
        );
    });

  });

  describe('extendOptions', () => {
    beforeAll(() => {
      jest.spyOn(proxyUtils, 'buildUrl').mockReturnValue('proxyUtils::buildurl');
    });
    beforeEach(() => {
      testSpecificMocks.proxyOptions = {
        _initial: 'value',
        target: '127.0.0.1',
      };
      testSpecificMocks.ssl = {
        cert: 'cert',
        private: 'private',
      };
      testSpecificMocks.dependency = {
        name: '127.0.0.4',
        patterns: [
          '/projects/*',
          '/idea/**',
        ],
      };
    });

    afterEach(() => {
      proxyUtils.buildUrl.mockClear();
    });
    afterAll(() => {
      proxyUtils.buildUrl.mockRestore();
    });

    it('nothing happens when dependency has falsy value', () => {
      testSpecificMocks.dependency = undefined;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: '127.0.0.1',
        }
      );
    });

    it('prepares url for target', () => {
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(proxyUtils.buildUrl).toHaveBeenCalledWith(
        testSpecificMocks.dependency
      );
    });

    it('updates by reference target from proxy options', () => {
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: proxyUtils.buildUrl(),
        }
      );
    });

    it('does not update/add ssl on proxy options when dependency has secure connection and ssl argument has falsy value', () => {
      testSpecificMocks.dependency.https = true;
      testSpecificMocks.ssl = undefined;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: proxyUtils.buildUrl(),
        }
      );
    });

    it('updates/adds by reference ssl from proxy options when dependency has secure connection and ssl argument has truthy value', () => {
      testSpecificMocks.dependency.https = true;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          ssl: {
            cert: testSpecificMocks.ssl.cert,
            key: testSpecificMocks.ssl['private'],
          },
          target: proxyUtils.buildUrl(),
        }
      );
    });

  });

});
