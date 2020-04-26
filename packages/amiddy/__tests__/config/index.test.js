
import path from 'path';

// testing file
import config, {privateApi} from '../../src/config';


import debug from '../../src/debug';


// mocks
jest.mock('path', () => (
  {
    isAbsolute: jest.fn().mockReturnValue(true),
    resolve: jest.fn().mockReturnValue('path::resolve'),
  }
));

jest.mock('../../src/debug', () => (
  {
    log: jest.fn(),
  }
));


describe('config', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });


  describe('privateApi.readFile', () => {

    it('returns content of the file as string when file exists', () => {
      expect(privateApi.readFile('__tests__/__fixtures__/config.json')).toMatchSnapshot();
    });

    it('throws error when file does not exists', () => {
      expect(() => {
        privateApi.readFile('__tests__/__fixtures__/noap.json');
      }).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.loadJSONConfigFile', () => {

    afterEach(() => {
      debug.log.mockClear();
    });

    it('logs debug message with the file path', () => {
      privateApi.loadJSONConfigFile('__tests__/__fixtures__/config.json');

      expect(debug.log).toHaveBeenCalledWith(
        'Loading JSON config file: __tests__/__fixtures__/config.json'
      );
    });

    it('logs debug message with the file path and error message if there was a problem', () => {
      try {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/invalid.json');
      } catch (e) {
      }

      expect(
        debug.log.mock.calls
      ).toEqual(
        [
          [
            'Loading JSON config file: __tests__/__fixtures__/invalid.json',
          ],
          [
            'Error reading JSON file: __tests__/__fixtures__/invalid.json',
          ],
        ]
      );
    });

    it('returns content of the file as object when file exists and is valid', () => {
      expect(privateApi.loadJSONConfigFile('__tests__/__fixtures__/config.json')).toMatchSnapshot();
    });

    it('throws error when file exists but does not have valid json', () => {
      expect(() => {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/invalid.json');
      }).toThrowErrorMatchingSnapshot();
    });

    it('throws error when file does not exists', () => {
      expect(() => {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/noap.json');
      }).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.isFile', () => {

    it('returns true when provided path as string represents a file', () => {
      expect(privateApi.isFile('__tests__/__fixtures__/config.json')).toBe(true);
    });

    it('returns false when provided path as string is a folder', () => {
      expect(privateApi.isFile('__tests__/__fixtures__')).toBe(false);
    });

    it('returns false when provided path as string is invalid', () => {
      expect(privateApi.isFile('__tests__/__fixtures__/noap.json')).toBe(false);
    });

  });

  describe('privateApi.getAbsolutePath', () => {
    beforeAll(() => {
      jest.spyOn(process, 'cwd').mockReturnValue('process::cwd');
      jest.spyOn(privateApi, 'isFile').mockReturnValue(true);
    });
    beforeEach(() => {
      testSpecificMocks.pathToResolve = 'path/to/resolve';
    });

    afterEach(() => {
      path.isAbsolute.mockClear();
      path.resolve.mockClear();
      process.cwd.mockClear();
      privateApi.isFile.mockClear();
    });
    afterAll(() => {
      process.cwd.mockRestore();
      privateApi.isFile.mockRestore();
    });

    it('determines current working directory of the Node.js process', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        process.cwd
      ).toHaveBeenCalledWith();
    });

    it('determines if provided path is absolute', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.isAbsolute
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve
      );
    });

    it('tries to resolve path when is not absolute', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.resolve
      ).toHaveBeenCalledWith(
        'process::cwd',
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is absolute)', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        'path::resolve',
      );
    });

    it('returns absolute path when it represents a file (path is absolute)', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('returns absolute path when it represents a file (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        'path::resolve',
      );
    });

    it('throws error when the path does not represents a file', () => {
      privateApi.isFile.mockReturnValueOnce(false);

      expect(
        () => {
          privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);
        }
      ).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.validate', () => {
    beforeEach(() => {
      testSpecificMocks.configObj = {
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

    it('no error is thrown when config object is valid', () => {
      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).not.toThrow();
    });

    it('throws error when missing `vhost`', () => {
      testSpecificMocks.configObj.vhost = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `vhost.name`', () => {
      testSpecificMocks.configObj.vhost.name = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when `source` is not an object (string)', () => {
      testSpecificMocks.configObj.source = 'str';

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when `source` is not an object (array)', () => {
      testSpecificMocks.configObj.source = [];

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `deps`', () => {
      testSpecificMocks.configObj.deps = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when `deps` is not an array', () => {
      testSpecificMocks.configObj.deps = {};

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error for every `dependency` that does not have patterns as array and ip or name', () => {
      testSpecificMocks.configObj.deps = [
        {
          ip: '127.0.0.1',
          name: 'example.com',
          patterns: [
            'aaaa',
          ],
        },
        {
          patterns: [],
        },
        {
          patterns: [
            'aaaa',
          ],
        },
        {
          ip: '127.0.0.1',
          patterns: [
            'aaaa',
          ],
        },
        {
          name: 'example.com',
          patterns: [
            'aaaa',
          ],
        },
      ];

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.getPort', () => {
    beforeEach(() => {
      testSpecificMocks.https = true;
      testSpecificMocks.defaultPort = 3000;
    });

    it('returns default port provided when it has truthy value', () => {
      expect(
        privateApi.getPort(testSpecificMocks.https, testSpecificMocks.defaultPort)
      ).toBe(3000);
    });

    it('returns 443 when default port has falsy value and https is truthy', () => {
      expect(
        privateApi.getPort(testSpecificMocks.https)
      ).toBe(443);
    });

    it('returns 80 when default port has falsy value and https is falsy', () => {
      testSpecificMocks.https = false;

      expect(
        privateApi.getPort(testSpecificMocks.https)
      ).toBe(80);
    });
  });

  describe('privateApi.setSourceDefaults', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getPort').mockReturnValue(80);
    });
    beforeEach(() => {
      testSpecificMocks.configObj = {
        deps: [],
        vhost: {},
      };
    });

    afterEach(() => {
      privateApi.getPort.mockClear();
    });
    afterAll(() => {
      privateApi.getPort.mockRestore();
    });

    it('when source port has falsy value it prepares port based on source.https and default port as 3000', () => {
      testSpecificMocks.configObj.source = {
        https: true,
      };
      privateApi.setSourceDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.getPort
      ).toHaveBeenCalledWith(
        testSpecificMocks.configObj.source.https,
        3000,
      );
    });

    it('updates by reference config object with source data (all props)', () => {
      privateApi.setSourceDefaults(testSpecificMocks.configObj);

      expect(
        testSpecificMocks.configObj
      ).toStrictEqual(
        {
          deps: [],
          source: {
            https: false,
            ip: '127.0.0.1',
            port: privateApi.getPort(),
          },
          vhost: {},
        }
      );
    });

    it('updates by reference config object with source data (missing props)', () => {
      testSpecificMocks.configObj.source = {
        port: 1098,
      };
      privateApi.setSourceDefaults(testSpecificMocks.configObj);

      expect(
        testSpecificMocks.configObj
      ).toStrictEqual(
        {
          deps: [],
          source: {
            https: false,
            ip: '127.0.0.1',
            port: 1098,
          },
          vhost: {},
        }
      );
    });

  });

  describe('privateApi.setVhostDefaults', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getPort').mockReturnValue(80);
    });
    beforeEach(() => {
      testSpecificMocks.configObj = {
        deps: [],
        source: {},
        vhost: {
          name: 'example.com',
        },
      };
    });

    afterEach(() => {
      privateApi.getPort.mockClear();
    });
    afterAll(() => {
      privateApi.getPort.mockRestore();
    });

    it('when vhost port has falsy value it prepares port based on vhost.https', () => {
      testSpecificMocks.configObj.vhost.https = true;
      privateApi.setVhostDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.getPort
      ).toHaveBeenCalledWith(
        testSpecificMocks.configObj.vhost.https,
      );
    });

    it('updates by reference config object with vhost data (all props)', () => {
      privateApi.setVhostDefaults(testSpecificMocks.configObj);

      expect(
        testSpecificMocks.configObj
      ).toStrictEqual(
        {
          deps: [],
          source: {},
          vhost: {
            https: false,
            name: 'example.com',
            port: privateApi.getPort(),
          },
        }
      );
    });

    it('updates by reference config object with vhost data (missing props)', () => {
      testSpecificMocks.configObj.vhost.port = 1098;
      privateApi.setVhostDefaults(testSpecificMocks.configObj);

      expect(
        testSpecificMocks.configObj
      ).toStrictEqual(
        {
          deps: [],
          source: {},
          vhost: {
            https: false,
            name: 'example.com',
            port: 1098,
          },
        }
      );
    });

  });

  describe('privateApi.setDepsDefaults', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getPort').mockReturnValue(80);
    });
    beforeEach(() => {
      testSpecificMocks.configObj = {
        deps: [
          {
            id: '8.8.7.7',
            patterns: [
              '/v1',
            ],
          },
          {
            https: true,
            name: 'example.com',
            patterns: [
              '/v2',
            ],
          },
        ],
        source: {},
        vhost: {},
      };
    });

    afterEach(() => {
      privateApi.getPort.mockClear();
    });
    afterAll(() => {
      privateApi.getPort.mockRestore();
    });

    it('when dependency port has falsy value it prepares port based on dependency.https', () => {
      testSpecificMocks.configObj.vhost.https = true;
      privateApi.setDepsDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.getPort.mock.calls
      ).toEqual(
        [
          [
            false,
          ],
          [
            true,
          ],
        ]
      );
    });

    it('updates by reference config object with deps data', () => {
      privateApi.setDepsDefaults(testSpecificMocks.configObj);

      expect(
        testSpecificMocks.configObj
      ).toStrictEqual(
        {
          deps: [
            {
              https: false,
              id: '8.8.7.7',
              patterns: [
                '/v1',
              ],
              port: privateApi.getPort(),
            },
            {
              https: true,
              name: 'example.com',
              patterns: [
                '/v2',
              ],
              port: privateApi.getPort(),
            },
          ],
          source: {},
          vhost: {},
        }
      );
    });

  });

  describe('privateApi.setDefaults', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'setSourceDefaults').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'setVhostDefaults').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'setDepsDefaults').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.configObj = {
        proxy: {
          ws: true,
        },
        source: {
          name: '127.0.0.1',
        },
        vhost: {
          name: 'http://github.com',
        },
      };
    });

    afterEach(() => {
      privateApi.setSourceDefaults.mockClear();
      privateApi.setVhostDefaults.mockClear();
      privateApi.setDepsDefaults.mockClear();
    });
    afterAll(() => {
      privateApi.setSourceDefaults.mockRestore();
      privateApi.setVhostDefaults.mockRestore();
      privateApi.setDepsDefaults.mockRestore();
    });

    it('updates by reference source from config obj', () => {
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.setSourceDefaults
      ).toHaveBeenCalledWith(
        testSpecificMocks.configObj
      );
    });

    it('updates by reference vhost from config obj', () => {
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.setVhostDefaults
      ).toHaveBeenCalledWith(
        testSpecificMocks.configObj
      );
    });

    it('updates by reference deps from config obj', () => {
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(
        privateApi.setDepsDefaults
      ).toHaveBeenCalledWith(
        testSpecificMocks.configObj
      );
    });

  });

  describe('get', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'setDefaults').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'validate').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'getAbsolutePath').mockReturnValue('/absolute/path/to/file');
      jest.spyOn(privateApi, 'loadJSONConfigFile').mockReturnValue(
        {
          data: 'confiObj',
        }
      );
    });
    beforeEach(() => {
      testSpecificMocks.pathToResolve = 'path/to/resolve';
    });

    afterEach(() => {
      privateApi.setDefaults.mockClear();
      privateApi.validate.mockClear();
      privateApi.getAbsolutePath.mockClear();
      privateApi.loadJSONConfigFile.mockClear();
    });
    afterAll(() => {
      privateApi.setDefaults.mockRestore();
      privateApi.validate.mockRestore();
      privateApi.getAbsolutePath.mockRestore();
      privateApi.loadJSONConfigFile.mockRestore();
    });

    it('uses `.amiddy` as file when path has falsy value', () => {
      config.get();

      expect(
        privateApi.getAbsolutePath
      ).toHaveBeenCalledWith(
        '.amiddy',
      );
    });

    it('retrieves absolute path to file', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.getAbsolutePath
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('loads json file', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.loadJSONConfigFile
      ).toHaveBeenCalledWith(
        privateApi.getAbsolutePath(),
      );
    });

    it('validates config object', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.validate
      ).toHaveBeenCalledWith(
        {
          data: 'confiObj',
        },
      );
    });

    it('set defaults on config object', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.setDefaults
      ).toHaveBeenCalledWith(
        {
          data: 'confiObj',
        },
      );
    });

    it('returns config object if is valid', () => {
      expect(
        config.get(testSpecificMocks.pathToResolve)
      ).toEqual(
        {
          data: 'confiObj',
        },
      );
    });

    it('throws error if config object is not valid', () => {
      privateApi.validate.mockImplementationOnce(
        () => {
          throw 'Throw';
        }
      );

      expect(
        () => {
          config.get(testSpecificMocks.pathToResolve);
        }
      ).toThrow('Throw');
    });

  });

});
