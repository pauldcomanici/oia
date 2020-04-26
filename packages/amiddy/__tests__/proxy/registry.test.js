
import url from 'url';

// testing file
import proxyRegistry, {privateApi} from '../../src/proxy/registry';


// mocks
jest.mock('url', () => (
  {
    format: jest.fn().mockReturnValue('https://github.com/darkyndy/amiddy'),
  }
));

describe('proxy-registry', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.id', () => {
    it('has 0 as default value', () => {
      expect(privateApi.id).toBe(0);
    });
  });

  describe('privateApi.registry', () => {
    it('has empty object as default value', () => {
      expect(privateApi.registry).toEqual({});
    });
  });

  describe('get', () => {
    beforeEach(() => {
      testSpecificMocks.id = 2;
    });
    afterEach(() => {
      // clear registry data
      privateApi.registry = {};
    });

    it('returns empty object when the id does not have any data registered', () => {
      expect(
        proxyRegistry.get(testSpecificMocks.id)
      ).toEqual({});
    });

    it('returns object with data when the id has data registered', () => {
      privateApi.registry[2] = {
        uri: 'http://www.darkyndy.com',
      };

      expect(
        proxyRegistry.get(testSpecificMocks.id)
      ).toEqual(
        {
          uri: 'http://www.darkyndy.com',
        }
      );
    });

  });

  describe('clear', () => {
    beforeEach(() => {
      testSpecificMocks.id = 2;
    });
    afterEach(() => {
      // clear registry data
      privateApi.registry = {};
    });

    it('clears stored data based on id from registry', () => {
      privateApi.registry[1] = {
        uri: 'https://www.npmjs.com/package/babel-plugin-auto-logger',
      };
      privateApi.registry[2] = {
        uri: 'http://www.darkyndy.com',
      };
      proxyRegistry.clear(testSpecificMocks.id);

      expect(
        privateApi.registry
      ).toEqual(
        {
          1: {
            uri: 'https://www.npmjs.com/package/babel-plugin-auto-logger',
          },
          2: undefined,
        }
      );
    });

  });

  describe('set', () => {
    beforeAll(() => {
      jest.spyOn(global.Date, 'now').mockReturnValue('current-time');
    });
    beforeEach(() => {
      // use specific id
      privateApi.id = 5;

      testSpecificMocks.proxyReq = {
        method: 'POST',
        path: '/darkyndy/amiddy',
        proxyReq: 'proxyReq',
      };
      testSpecificMocks.req = {
        req: 'req',
      };
      testSpecificMocks.res = {
        res: 'res',
      };
      testSpecificMocks.options = {
        target: {
          auth: null,
          hash: null,
          host: '127.0.0.1',
          hostname: '127.0.0.1',
          href: 'http://127.0.0.1:80/',
          path: '/',
          pathname: '/images/test.png',
          port: '80',
          protocol: 'http:',
          query: null,
          search: null,
          slashes: true,
        },
      };
    });

    afterEach(() => {
      url.format.mockClear();
      global.Date.now.mockClear();

      // clear registry data
      privateApi.registry = {};
      // clear registry id
      privateApi.id = 0;
    });
    afterAll(() => {
      global.Date.now.mockRestore();
    });

    it('retrieves current time', () => {
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        global.Date.now
      ).toHaveBeenCalledWith();
    });

    it('updates registry id for the next request', () => {
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        privateApi.id
      ).toBe(6);
    });

    it('formats the url', () => {
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        url.format
      ).toHaveBeenCalledWith(
        {
          ...testSpecificMocks.options.target,
          pathname: testSpecificMocks.proxyReq.path,
        }
      );
    });

    it('stores data in registry for the request id', () => {
      privateApi.registry[4] = {
        uri: 'https://github.com/darkyndy',
      };
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        privateApi.registry
      ).toEqual(
        {
          4: {
            uri: 'https://github.com/darkyndy',
          },
          5: {
            method: 'POST',
            startTime: 'current-time',
            uri: 'https://github.com/darkyndy/amiddy',
          },
        }
      );
    });

    it('sets property on request to identify it when receiving response', () => {
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        testSpecificMocks.req
      ).toEqual(
        {
          __amiddyId__: 5,
          req: 'req',
        }
      );
    });

    it('sets property on response to identify it when receiving response', () => {
      proxyRegistry.set(
        testSpecificMocks.proxyReq,
        testSpecificMocks.req,
        testSpecificMocks.res,
        testSpecificMocks.options,
      );

      expect(
        testSpecificMocks.res
      ).toEqual(
        {
          __amiddyId__: 5,
          res: 'res',
        }
      );
    });

  });

});
