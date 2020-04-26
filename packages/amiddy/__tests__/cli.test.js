
// testing file
import cli, {privateApi} from '../src/cli';


import config from '../src/config';
import debug from '../src/debug';
import server from '../src/server';

// mocks
jest.mock('../src/config', () => (
  {
    get: jest.fn().mockReturnValue(
      {
        deps: [],
        source: {},
        vhost: {},
      }
    ),
  }
));
jest.mock('../src/debug', () => (
  {
    activate: jest.fn(),
    block: jest.fn(),
  }
));
jest.mock('../src/server', () => (
  {
    create: jest.fn(),
  }
));


describe('cli', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getArgs', () => {
    it('returns array with strings, arguments provided from cli where the first 2 are removed', () => {
      // this isn't the perfect test, but I do not want to change data from process
      expect(
        privateApi.getArgs()
      ).toEqual(
        process.argv.slice(2)
      );
    });
  });

  describe('privateApi.extractArgs', () => {
    beforeEach(() => {
      testSpecificMocks.args = [];
    });

    it('returns empty object when array with arguments does not contain accepted props', () => {
      testSpecificMocks.args = [
        '--invalid=val',
        '--other=',
      ];
      expect(
        privateApi.extractArgs(testSpecificMocks.args)
      ).toEqual({});
    });

    it('returns empty object when array with arguments does not contain accepted props that have valid data', () => {
      testSpecificMocks.args = [
        '--invalid=val',
        '--other=',
        '--config=',
      ];
      expect(
        privateApi.extractArgs(testSpecificMocks.args)
      ).toEqual({});
    });

    it('returns object with key as accepted argument and his value based on array provided', () => {
      testSpecificMocks.args = [
        '--arg',
        '--invalid=val',
        '--debug',
        '--config=path',
        '--other=',
        '-c=path/to/file.json',
      ];
      expect(
        privateApi.extractArgs(testSpecificMocks.args)
      ).toEqual(
        {
          config: 'path/to/file.json',
          debug: true,
        }
      );
    });

    it('returns object with key as accepted argument and his value based on array provided (`-d`)', () => {
      testSpecificMocks.args = [
        '--invalid=val',
        '-d',
        '--config=path',
        '--other=',
        '-c',
      ];
      expect(
        privateApi.extractArgs(testSpecificMocks.args)
      ).toEqual(
        {
          config: 'path',
          debug: true,
        }
      );
    });

  });

  describe('run', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getArgs').mockReturnValue(
        [
          '--config=path/to/config.json',
          '--debug',
        ]
      );
      jest.spyOn(privateApi, 'extractArgs').mockReturnValue(
        {
          config: 'path/to/config.json',
          debug: true,
        }
      );
    });
    beforeEach(() => {
      testSpecificMocks.configObj = {
        deps: [],
        source: {},
        vhost: {},
      };
    });

    afterEach(() => {
      privateApi.getArgs.mockClear();
      privateApi.extractArgs.mockClear();
      config.get.mockClear();
      debug.activate.mockClear();
      debug.block.mockClear();
      server.create.mockClear();
    });
    afterAll(() => {
      privateApi.getArgs.mockRestore();
      privateApi.extractArgs.mockRestore();
    });

    it('retrieves arguments', () => {
      cli.run();

      expect(privateApi.getArgs).toHaveBeenCalledWith();
    });

    it('extracts useful arguments as object', () => {
      cli.run();

      expect(privateApi.extractArgs).toHaveBeenCalledWith(
        [
          '--config=path/to/config.json',
          '--debug',
        ]
      );
    });

    it('does not activate debug mode when the debug argument was not provided', () => {
      privateApi.extractArgs.mockReturnValueOnce({});
      cli.run();

      expect(debug.activate).not.toHaveBeenCalled();
    });

    it('activates debug mode based on arguments', () => {
      cli.run();

      expect(debug.activate).toHaveBeenCalledWith();
    });

    it('retrieves configuration based on config from arguments', () => {
      cli.run();

      expect(config.get).toHaveBeenCalledWith(
        'path/to/config.json'
      );
    });

    it('creates server', () => {
      cli.run();

      expect(server.create).toHaveBeenCalledWith(
        testSpecificMocks.configObj
      );
    });

    it('logs debug data', () => {
      cli.run();

      expect(debug.block).toHaveBeenCalledWith(
        '\nUsing options:',
        {
          config: 'path/to/config.json',
          debug: true,
        },
        '\nUsing configuration:',
        JSON.stringify(testSpecificMocks.configObj)
      );
    });

  });

});
