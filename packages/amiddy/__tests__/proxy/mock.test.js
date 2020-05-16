
// testing file
import proxyMock, {privateApi} from '../../src/proxy/mock';

import proxyUtils from '../../src/proxy/utils';
import proxyRegistry from '../../src/proxy/registry';

import logger from '../../src/logger';
import file from '../../src/file';

jest.mock('../../src/logger', () => (
  {
    error: jest.fn(),
    response: jest.fn(),
  }
));
jest.mock('../../src/file', () => (
  {
    getAbsolutePath: jest.fn().mockImplementation(() => '/absolute/path/to/file'),
    read: jest.fn().mockImplementation(() => '{"valid":true}'),
  }
));


describe('proxy-mock', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getHeaders', () => {
    beforeEach(() => {
      testSpecificMocks.mock = {
        headers: {
          'x-mock': 'value-mock',
        },
      };
      testSpecificMocks.options = {
        headers: {
          'x-options': 'value-options',
        },
      };
    });

    it('returns object with headers merged from mock & options', () => {
      expect(
        privateApi.getHeaders(testSpecificMocks.mock, testSpecificMocks.options)
      ).toStrictEqual({
        'x-mock': 'value-mock',
        'x-options': 'value-options',
      });
    });

    it('returns object with headers merged from mock & options (headers from mock have higher priority)', () => {
      testSpecificMocks.options['x-mock'] = 'value-options-ignored';

      expect(
        privateApi.getHeaders(testSpecificMocks.mock, testSpecificMocks.options)
      ).toStrictEqual({
        'x-mock': 'value-mock',
        'x-options': 'value-options',
      });
    });

    it('returns empty object when we do not have headers for mock or options', () => {
      testSpecificMocks.mock = {};
      testSpecificMocks.options = {};

      expect(
        privateApi.getHeaders(testSpecificMocks.mock, testSpecificMocks.options)
      ).toStrictEqual({});
    });
  });

  describe('privateApi.getResponse', () => {
    beforeEach(() => {
      testSpecificMocks.mock = {
        fixture: '__tests__/__fixtures__/response.json',
        response: 'test',
      };
    });

    afterEach(() => {
      file.getAbsolutePath.mockClear();
      file.read.mockClear();
      logger.error.mockClear();
    });

    it('retrieves absolute path for the file when fixture has value', () => {
      privateApi.getResponse(testSpecificMocks.mock);

      expect(
        file.getAbsolutePath
      ).toHaveBeenCalledWith(
        testSpecificMocks.mock.fixture
      );
    });

    it('retrieves file content when fixture has value and absolute path could be determined', () => {
      privateApi.getResponse(testSpecificMocks.mock);

      expect(
        file.read
      ).toHaveBeenCalledWith(
        '/absolute/path/to/file'
      );
    });

    it('returns value from file content when fixture has value', () => {

      expect(
        privateApi.getResponse(testSpecificMocks.mock)
      ).toEqual({
        valid: true,
      });
    });

    it('returns value from response when fixture does not have value', () => {
      testSpecificMocks.mock.fixture = undefined;

      expect(
        privateApi.getResponse(testSpecificMocks.mock)
      ).toBe(testSpecificMocks.mock.response);
    });

    it('returns empty string when fixture or response does not have value', () => {
      testSpecificMocks.mock.fixture = undefined;
      testSpecificMocks.mock.response = undefined;

      expect(
        privateApi.getResponse(testSpecificMocks.mock)
      ).toBe('');
    });

    it('logs error when we cannot retrieve absolute path for fixture if it has value', () => {
      testSpecificMocks.error = 'Cannot get absolute path';
      file.getAbsolutePath.mockImplementationOnce(
        () => {
          throw Error(testSpecificMocks.error);
        }
      );
      privateApi.getResponse(testSpecificMocks.mock);

      expect(
        logger.error
      ).toHaveBeenCalledWith(testSpecificMocks.error);
    });

    it('returns empty string when fixture has value but we cannot retrieve absolute path for it and response does not has value', () => {
      testSpecificMocks.mock.response = undefined;
      file.getAbsolutePath.mockImplementationOnce(
        () => {
          throw 'Cannot get absolute path';
        }
      );

      expect(
        privateApi.getResponse(testSpecificMocks.mock)
      ).toBe('');
    });

    it('logs error when we cannot read file content for fixture if it has value', () => {
      testSpecificMocks.error = 'Cannot read file';
      file.read.mockImplementationOnce(
        () => {
          throw Error(testSpecificMocks.error);
        }
      );
      privateApi.getResponse(testSpecificMocks.mock);

      expect(
        logger.error
      ).toHaveBeenCalledWith(testSpecificMocks.error);
    });

    it('returns empty string when fixture has value but we cannot read file content and response does not has value', () => {
      testSpecificMocks.mock.response = undefined;
      file.read.mockImplementationOnce(
        () => {
          throw 'Cannot read file';
        }
      );

      expect(
        privateApi.getResponse(testSpecificMocks.mock)
      ).toBe('');
    });
  });

  describe('privateApi.get', () => {
    beforeAll(() => {
      jest.spyOn(proxyUtils, 'getMock').mockReturnValue({
        patterns: [
          '/api/endpoint**'
        ],
        response: 'test',
        status: 206,
      });
      jest.spyOn(privateApi, 'getHeaders').mockReturnValue({
        'x-mock-header': 'for-response-mock',
        'x-proxy-header': 'for-response',
      });
      jest.spyOn(privateApi, 'getResponse').mockReturnValue('test');
    });
    beforeEach(() => {
      testSpecificMocks.dependency = {
        mocks: [
          {
            patterns: [
              '/api/endpoint**'
            ],
            response: 'test',
            status: 206,
          },
        ],
      };
      testSpecificMocks.url = '/part/of/url';
      testSpecificMocks.method = 'GET';
      testSpecificMocks.options = {
        headers: {
          'x-proxy-header': 'for-response',
        },
      };
    });

    afterEach(() => {
      proxyUtils.getMock.mockClear();
      privateApi.getHeaders.mockClear();
      privateApi.getResponse.mockClear();
    });
    afterAll(() => {
      proxyUtils.getMock.mockRestore();
      privateApi.getHeaders.mockRestore();
      privateApi.getResponse.mockRestore();
    });

    it('retrieves mock to be used for current dependency based on url and method', () => {
      privateApi.get(
        testSpecificMocks.dependency,
        testSpecificMocks.url,
        testSpecificMocks.method,
        testSpecificMocks.options
      );

      expect(proxyUtils.getMock).toHaveBeenCalledWith(
        testSpecificMocks.dependency.mocks,
        testSpecificMocks.url,
        testSpecificMocks.method,
      );
    });

    it('retrieves headers for the response based on mock data and options as mock was determined', () => {
      privateApi.get(
        testSpecificMocks.dependency,
        testSpecificMocks.url,
        testSpecificMocks.method,
        testSpecificMocks.options
      );

      expect(privateApi.getHeaders).toHaveBeenCalledWith(
        testSpecificMocks.dependency.mocks[0],
        testSpecificMocks.options,
      );
    });

    it('retrieves response content based on mock as mock was determined', () => {
      privateApi.get(
        testSpecificMocks.dependency,
        testSpecificMocks.url,
        testSpecificMocks.method,
        testSpecificMocks.options
      );

      expect(privateApi.getResponse).toHaveBeenCalledWith(
        testSpecificMocks.dependency.mocks[0],
      );
    });

    it('returns object with headers, response & status (from mock) when mock was determined', () => {
      expect(
        privateApi.get(
          testSpecificMocks.dependency,
          testSpecificMocks.url,
          testSpecificMocks.method,
          testSpecificMocks.options
        )
      ).toStrictEqual(
        {
          headers: privateApi.getHeaders(),
          response: privateApi.getResponse(),
          status: testSpecificMocks.dependency.mocks[0].status,
        }
      );
    });

    it('returns object with headers, response & status (default) when mock was determined', () => {
      proxyUtils.getMock.mockReturnValueOnce({
        patterns: [
          '/api/endpoint**'
        ],
        response: 'test',
      });

      expect(
        privateApi.get(
          testSpecificMocks.dependency,
          testSpecificMocks.url,
          testSpecificMocks.method,
          testSpecificMocks.options
        )
      ).toStrictEqual(
        {
          headers: privateApi.getHeaders(),
          response: privateApi.getResponse(),
          status: 200,
        }
      );
    });

    it('returns undefined when mock was not determined', () => {
      proxyUtils.getMock.mockReturnValueOnce(undefined);

      expect(
        privateApi.get(
          testSpecificMocks.dependency,
          testSpecificMocks.url,
          testSpecificMocks.method,
          testSpecificMocks.options
        )
      ).toBe(
        undefined
      );
    });

  });

  describe('execute', () => {
    beforeAll(() => {
      jest.spyOn(proxyRegistry, 'generateEntry').mockReturnValue({
        method: 'GET',
      });
      jest.spyOn(proxyUtils, 'buildUrlObject').mockReturnValue({
        host: 'https://example.com'
      });
      jest.spyOn(privateApi, 'get').mockReturnValue({
        headers: {
          'x-mock-header': 'add-mock-header',
          'x-proxy-header': 'add-proxy-header',
        },
        response: 'test',
        status: 200,
      });

    });
    beforeEach(() => {
      testSpecificMocks.req = {
        method: 'GET',
        req: 'req',
        url: 'http://example.com/api/test',
      };
      testSpecificMocks.res = {
        res: 'res',
        send: jest.fn(),
        setHeader: jest.fn(),
        status: jest.fn(),
      };
      testSpecificMocks.dependency = {
        mocks: [
          {
            patterns: [
              '/api/endpoint**'
            ],
            response: 'test',
            status: 206,
          },
        ],
      };
      testSpecificMocks.config = {
        options: {
          mock: {
            enabled: true,
          }
        },
        proxy: {
          response: {
            headers: {
              'x-proxy-header': 'for-response',
            },
          },
        },
      };
    });

    afterEach(() => {
      privateApi.get.mockClear();
      proxyRegistry.generateEntry.mockClear();
      proxyUtils.buildUrlObject.mockClear();
      logger.response.mockClear();
    });
    afterAll(() => {
      privateApi.get.mockRestore();
      proxyRegistry.generateEntry.mockRestore();
      proxyUtils.buildUrlObject.mockRestore();
    });

    it('determines the mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        privateApi.get
      ).toHaveBeenCalledWith(
        testSpecificMocks.dependency,
        testSpecificMocks.req.url,
        testSpecificMocks.req.method,
        testSpecificMocks.config.proxy.response,
      );
    });

    it('sets headers on response when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        testSpecificMocks.res.setHeader.mock.calls
      ).toEqual(
        [
          ['x-mock-header', 'add-mock-header'],
          ['x-proxy-header', 'add-proxy-header']
        ]
      );
    });

    it('sets response status when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        testSpecificMocks.res.status
      ).toHaveBeenCalledWith(
        200
      );
    });

    it('sets response content when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        testSpecificMocks.res.send
      ).toHaveBeenCalledWith(
        'test'
      );
    });

    it('prepares Url object as it is needed to prepare entry in registry when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        proxyUtils.buildUrlObject
      ).toHaveBeenCalledWith(
        testSpecificMocks.dependency
      );
    });

    it('prepares entry data for registry when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        proxyRegistry.generateEntry
      ).toHaveBeenCalledWith(
        {
          method: testSpecificMocks.req.method,
          path: testSpecificMocks.req.url,
        },
        {
          target: proxyUtils.buildUrlObject(),
        }
      );
    });

    it('logs the mocked response when we have a mock for this request', () => {
      proxyMock.execute(
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.dependency,
        testSpecificMocks.config,
      );

      expect(
        logger.response
      ).toHaveBeenCalledWith(
        proxyRegistry.generateEntry(),
        {
          statusCode: 200,
        }
      );
    });

    it('returns true when we have a mock for this request as the request was mocked', () => {
      expect(
        proxyMock.execute(
          testSpecificMocks.req,
          testSpecificMocks.res,
          testSpecificMocks.dependency,
          testSpecificMocks.config,
        )
      ).toBe(
        true
      );
    });

    it('returns false when we do not have a mock for this request as the request should be proxied', () => {
      privateApi.get.mockReturnValueOnce(undefined);

      expect(
        proxyMock.execute(
          testSpecificMocks.req,
          testSpecificMocks.res,
          testSpecificMocks.dependency,
          testSpecificMocks.config,
        )
      ).toBe(
        false
      );
    });

    it('returns false when mocking is not enabled', () => {
      testSpecificMocks.config.options.mock.enabled = false;

      expect(
        proxyMock.execute(
          testSpecificMocks.req,
          testSpecificMocks.res,
          testSpecificMocks.dependency,
          testSpecificMocks.config,
        )
      ).toBe(
        false
      );
    });

  });

});
