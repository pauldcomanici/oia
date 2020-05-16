
// testing file
import proxyListen from '../../src/proxy/listen';


import logger from '../../src/logger';
import proxyRegistry from '../../src/proxy/registry';
import proxyRecorder from '../../src/proxy/recorder';


// mocks
jest.mock('../../src/logger', () => (
  {
    error: jest.fn(),
    response: jest.fn(),
  }
));
jest.mock('../../src/proxy/registry', () => (
  {
    clear: jest.fn(),
    get: jest.fn().mockReturnValue(
      {
        uri: 'http://www.darkyndy.com',
      }
    ),
    set: jest.fn(),
  }
));
jest.mock('../../src/proxy/recorder', () => (
  {
    saveResponse: jest.fn(),
  }
));


describe('proxy-listen', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });


  describe('request', () => {
    beforeEach(() => {
      testSpecificMocks.proxyReq = {
        proxyReq: 'proxyReq',
      };
      testSpecificMocks.req = {
        req: 'req',
      };
      testSpecificMocks.res = {
        res: 'res',
      };
      testSpecificMocks.options = {
        options: 'options',
      };
    });

    afterEach(() => {
      proxyRegistry.set.mockClear();
    });

    it('registers request', () => {
      proxyListen.request(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        proxyRegistry.set
      ).toHaveBeenCalledWith(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );
    });

  });

  describe('response', () => {
    beforeEach(() => {
      testSpecificMocks.config = {
        proxy: {
          response: {
            headers: {
              'X-Special-Proxy-Header': 'on-response',
            },
          },
        },
      };

      testSpecificMocks.proxyReq = {
        proxyReq: 'proxyReq',
        statusCode: 200,
      };
      testSpecificMocks.req = {
        __amiddyId__: 1,
        req: 'req',
      };
      testSpecificMocks.res = {
        __amiddyId__: 1,
        res: 'res',
        setHeader: jest.fn(),
      };
    });

    afterEach(() => {
      proxyRecorder.saveResponse.mockClear();
      logger.response.mockClear();
      proxyRegistry.clear.mockClear();
      proxyRegistry.get.mockClear();
    });

    it('nothing happens when request id does not match response id (response from other request)', () => {
      testSpecificMocks.req.__amiddyId__ = 2;
      proxyListen.response(testSpecificMocks.config)(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        logger.response
      ).not.toHaveBeenCalled();
    });

    it('tries to save the response', () => {
      proxyListen.response(testSpecificMocks.config)(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        proxyRecorder.saveResponse
      ).toHaveBeenCalledWith(
        testSpecificMocks.proxyReq,
        testSpecificMocks.config,
      );
    });

    it('retrieves stored data from registry when response is for the tracked request', () => {
      proxyListen.response(testSpecificMocks.config)(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        proxyRegistry.get
      ).toHaveBeenCalledWith(
        testSpecificMocks.req.__amiddyId__,
      );
    });

    it('logs response data when response is for the tracked request', () => {
      proxyListen.response(testSpecificMocks.config)(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        logger.response
      ).toHaveBeenCalledWith(
        {
          uri: 'http://www.darkyndy.com',
        },
        testSpecificMocks.proxyReq,
      );
    });

    it('clears registry data when response is for the tracked request', () => {
      proxyListen.response(testSpecificMocks.config)(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        proxyRegistry.clear
      ).toHaveBeenCalledWith(
        testSpecificMocks.req.__amiddyId__,
      );
    });

  });

  describe('error', () => {
    beforeEach(() => {
      testSpecificMocks.error = {
        code: 'ERROR',
        error: 'error',
        message: 'error happened',
        statusCode: 200,
      };
      testSpecificMocks.req = {
        __amiddyId__: 1,
        req: 'req',
      };
      testSpecificMocks.res = {
        __amiddyId__: 1,
        end: jest.fn(),
        headersSent: false,
        res: 'res',
        writeHead: jest.fn(),
      };
    });

    afterEach(() => {
      logger.error.mockClear();
    });

    it('logs error message when the error code is not `ECONNRESET`', () => {
      proxyListen.error(
        testSpecificMocks.error,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        logger.error
      ).toHaveBeenCalledWith(
        testSpecificMocks.error.message,
        'proxy',
      );
    });

    it('nothing is logged when the error code is `ECONNRESET`', () => {
      testSpecificMocks.error.code = 'ECONNRESET';
      proxyListen.error(
        testSpecificMocks.error,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        logger.error
      ).not.toHaveBeenCalled();
    });

    it('sends a response header with status code 500 when header was not sent', () => {
      proxyListen.error(
        testSpecificMocks.error,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        testSpecificMocks.res.writeHead
      ).toHaveBeenCalledWith(
        500
      );
    });

    it('does not sends a response header when header was sent', () => {
      testSpecificMocks.res.headersSent = true;
      proxyListen.error(
        testSpecificMocks.error,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        testSpecificMocks.res.writeHead
      ).not.toHaveBeenCalled();
    });

    it('signal to the server that all of the response headers and body have been sent', () => {
      proxyListen.error(
        testSpecificMocks.error,
        testSpecificMocks.req,
        testSpecificMocks.res,
      );

      expect(
        testSpecificMocks.res.end
      ).toHaveBeenCalledWith(
        `Proxy error occurred: ${testSpecificMocks.error.message}`
      );
    });

  });

});
