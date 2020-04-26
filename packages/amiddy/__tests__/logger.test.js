
import chalk from 'chalk';

// testing file
import logger, {privateApi} from '../src/logger';

// mocks
jest.mock('chalk', () => ({
  bgBlue: {
    black: jest.fn().mockReturnValue('bg_blue-black'),
    white: jest.fn().mockReturnValue('bg_blue-white'),
  },
  bgBlueBright: {
    black: jest.fn().mockReturnValue('bg_blueBright-black'),
    white: jest.fn().mockReturnValue('bg_blueBright-white'),
  },
  bgCyan: {
    black: jest.fn().mockReturnValue('bg_cyan-black'),
    white: jest.fn().mockReturnValue('bg_cyan-white'),
  },
  bgCyanBright: {
    black: jest.fn().mockReturnValue('bg_cyanBright-black'),
    white: jest.fn().mockReturnValue('bg_cyanBright-white'),
  },
  bgGreen: {
    black: jest.fn().mockReturnValue('bg_green-black'),
    white: jest.fn().mockReturnValue('bg_green-white'),
  },
  bgMagenta: {
    black: jest.fn().mockReturnValue('bg_magenta-black'),
    white: jest.fn().mockReturnValue('bg_magenta-white'),
  },
  bgRed: {
    black: jest.fn().mockReturnValue('bg_red-black'),
    white: jest.fn().mockReturnValue('bg_red-white'),
  },
  gray: jest.fn().mockReturnValue('gray'),
  green: jest.fn().mockReturnValue('green'),
  magenta: jest.fn().mockReturnValue('magenta'),
  red: jest.fn().mockReturnValue('red'),
  redBright: jest.fn().mockReturnValue('redBright'),
  yellow: jest.fn().mockReturnValue('yellow'),
}));


describe('logger', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.message', () => {
    beforeAll(() => {
      jest.spyOn(console, 'log').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.message = 'message';
      testSpecificMocks.category = 'start';
      testSpecificMocks.type = 'success';
    });

    afterEach(() => {
      chalk.bgGreen.black.mockClear();
      chalk.green.mockClear();
      chalk.bgRed.black.mockClear();
      chalk.red.mockClear();
      console.log.mockClear(); // eslint-disable-line no-console
    });
    afterAll(() => {
      console.log.mockRestore(); // eslint-disable-line no-console
    });

    it('prepares message for category when it has truthy value based on type as success as provided type was invalid', () => {
      testSpecificMocks.type = 'invalid';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.bgGreen.black
      ).toHaveBeenCalledWith(
        '[start]'
      );
    });

    it('prepares message for text based on type as success as provided type was invalid', () => {
      testSpecificMocks.type = 'invalid';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.green
      ).toHaveBeenCalledWith(
        testSpecificMocks.message
      );
    });

    it('logs message (category has falsy value) based on type as success as provided type was invalid', () => {
      testSpecificMocks.type = 'invalid';
      testSpecificMocks.category = '';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        ' green'
      );
    });

    it('logs message (category has truthy value) based on type as success as provided type was invalid', () => {
      testSpecificMocks.type = 'invalid';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        'bg_green-black green'
      );
    });

    it('prepares message for category when it has truthy value based on type as success', () => {
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.bgGreen.black
      ).toHaveBeenCalledWith(
        '[start]'
      );
    });

    it('prepares message for text based on type as success', () => {
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.green
      ).toHaveBeenCalledWith(
        testSpecificMocks.message
      );
    });

    it('logs message (category has falsy value) based on type as success', () => {
      testSpecificMocks.category = '';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        ' green'
      );
    });

    it('logs message (category has truthy value) based on type as success', () => {
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        'bg_green-black green'
      );
    });

    it('prepares message for category when it has truthy value based on type as error', () => {
      testSpecificMocks.type = 'error';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.bgRed.white
      ).toHaveBeenCalledWith(
        '[start]'
      );
    });

    it('prepares message for text based on type as error', () => {
      testSpecificMocks.type = 'error';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        chalk.red
      ).toHaveBeenCalledWith(
        testSpecificMocks.message
      );
    });

    it('logs message (category has falsy value) based on type as error', () => {
      testSpecificMocks.category = '';
      testSpecificMocks.type = 'error';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        ' red'
      );
    });

    it('logs message (category has truthy value) based on type as error', () => {
      testSpecificMocks.type = 'error';
      privateApi.message(
        testSpecificMocks.message,
        testSpecificMocks.category,
        testSpecificMocks.type,
      );

      expect(
        console.log // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        'bg_red-white red'
      );
    });

  });

  describe('privateApi.method', () => {
    beforeEach(() => {
      testSpecificMocks.method = 'GET';
    });

    afterEach(() => {
      chalk.bgMagenta.black.mockClear();
      chalk.bgGreen.black.mockClear();
      chalk.bgRed.black.mockClear();
      chalk.bgCyanBright.black.mockClear();
      chalk.bgCyan.black.mockClear();
      chalk.bgBlue.black.mockClear();
      chalk.bgBlueBright.black.mockClear();
    });

    it('prepares message with method name using fallback color when method is not recognised', () => {
      testSpecificMocks.method = 'NOT_VALID';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgMagenta.black
      ).toHaveBeenCalledWith(
        ' NOT_VALID '
      );
    });

    it('returns message with method name using fallback color when method is not recognised', () => {
      testSpecificMocks.method = 'NOT_VALID';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgMagenta.black()
      );
    });

    it('prepares message with method name using color specified when method is `GET`', () => {
      testSpecificMocks.method = 'GET';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgGreen.black
      ).toHaveBeenCalledWith(
        ' GET     '
      );
    });

    it('returns message with method name using color specified when method is `GET`', () => {
      testSpecificMocks.method = 'GET';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgGreen.black()
      );
    });

    it('prepares message with method name using color specified when method is `DELETE`', () => {
      testSpecificMocks.method = 'DELETE';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgRed.white
      ).toHaveBeenCalledWith(
        ' DELETE  '
      );
    });

    it('returns message with method name using color specified when method is `DELETE`', () => {
      testSpecificMocks.method = 'DELETE';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgRed.white()
      );
    });

    it('prepares message with method name using color specified when method is `HEAD`', () => {
      testSpecificMocks.method = 'HEAD';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgCyanBright.black
      ).toHaveBeenCalledWith(
        ' HEAD    '
      );
    });

    it('returns message with method name using color specified when method is `DELETE`', () => {
      testSpecificMocks.method = 'HEAD';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgCyanBright.black()
      );
    });

    it('prepares message with method name using color specified when method is `PATCH`', () => {
      testSpecificMocks.method = 'PATCH';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgCyan.black
      ).toHaveBeenCalledWith(
        ' PATCH   '
      );
    });

    it('returns message with method name using color specified when method is `PATCH`', () => {
      testSpecificMocks.method = 'PATCH';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgCyan.black()
      );
    });

    it('prepares message with method name using color specified when method is `POST`', () => {
      testSpecificMocks.method = 'POST';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgBlue.white
      ).toHaveBeenCalledWith(
        ' POST    '
      );
    });

    it('returns message with method name using color specified when method is `POST`', () => {
      testSpecificMocks.method = 'POST';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgBlue.white()
      );
    });

    it('prepares message with method name using color specified when method is `PUT`', () => {
      testSpecificMocks.method = 'PUT';
      privateApi.method(testSpecificMocks.method);

      expect(
        chalk.bgBlueBright.white
      ).toHaveBeenCalledWith(
        ' PUT     '
      );
    });

    it('returns message with method name using color specified when method is `PUT`', () => {
      testSpecificMocks.method = 'PUT';

      expect(
        privateApi.method(testSpecificMocks.method)
      ).toBe(
        chalk.bgBlueBright.white()
      );
    });

  });

  describe('privateApi.status', () => {
    beforeEach(() => {
      testSpecificMocks.status = 200;
    });

    afterEach(() => {
      chalk.magenta.mockClear();
      chalk.green.mockClear();
      chalk.yellow.mockClear();
      chalk.redBright.mockClear();
      chalk.red.mockClear();
    });

    it('prepares status code message using fallback color when status is < 200', () => {
      testSpecificMocks.status = 199;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.magenta
      ).toHaveBeenCalledWith(
        ' 199 '
      );
    });

    it('returns status code message using fallback color when status is < 200', () => {
      testSpecificMocks.status = 199;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.magenta()
      );
    });

    it('prepares status code message using fallback color when status is >= 600', () => {
      testSpecificMocks.status = 600;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.magenta
      ).toHaveBeenCalledWith(
        ' 600 '
      );
    });

    it('returns status code message using fallback color when status is >= 600', () => {
      testSpecificMocks.status = 600;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.magenta()
      );
    });

    it('prepares status code message using color for 2xx status codes', () => {
      testSpecificMocks.status = 202;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.green
      ).toHaveBeenCalledWith(
        ' 202 '
      );
    });

    it('returns status code message using color for 2xx status codes', () => {
      testSpecificMocks.status = 201;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.green()
      );
    });

    it('prepares status code message using color for 3xx status codes', () => {
      testSpecificMocks.status = 302;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.yellow
      ).toHaveBeenCalledWith(
        ' 302 '
      );
    });

    it('returns status code message using color for 3xx status codes', () => {
      testSpecificMocks.status = 301;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.yellow()
      );
    });

    it('prepares status code message using color for 4xx status codes', () => {
      testSpecificMocks.status = 404;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.redBright
      ).toHaveBeenCalledWith(
        ' 404 '
      );
    });

    it('returns status code message using color for 4xx status codes', () => {
      testSpecificMocks.status = 405;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.redBright()
      );
    });

    it('prepares status code message using color for 5xx status codes', () => {
      testSpecificMocks.status = 501;
      privateApi.status(testSpecificMocks.status);

      expect(
        chalk.red
      ).toHaveBeenCalledWith(
        ' 501 '
      );
    });

    it('returns status code message using color for 5xx status codes', () => {
      testSpecificMocks.status = 503;

      expect(
        privateApi.status(testSpecificMocks.status)
      ).toBe(
        chalk.red()
      );
    });
  });

  describe('privateApi.time', () => {
    beforeEach(() => {
      testSpecificMocks.start = 100;
      testSpecificMocks.end = 101;

      chalk.gray.mockReturnValue('time-message');
    });

    afterEach(() => {
      chalk.gray.mockClear();
    });

    it('prepares execution time message where delta is in milliseconds', () => {
      privateApi.time(testSpecificMocks.start, testSpecificMocks.end);

      expect(chalk.gray).toHaveBeenCalledWith(
        '    1 ms '
      );
    });

    it('prepares execution time message where delta is in seconds < 10', () => {
      testSpecificMocks.end = 1111;
      privateApi.time(testSpecificMocks.start, testSpecificMocks.end);

      expect(chalk.gray).toHaveBeenCalledWith(
        ' 1.01  s '
      );
    });

    it('prepares execution time message where delta is in seconds > 10', () => {
      testSpecificMocks.end = 12011;
      privateApi.time(testSpecificMocks.start, testSpecificMocks.end);

      expect(chalk.gray).toHaveBeenCalledWith(
        ' 11.9  s '
      );
    });

    it('prepares execution time message where delta is in seconds > 100', () => {
      testSpecificMocks.end = 122011;
      privateApi.time(testSpecificMocks.start, testSpecificMocks.end);

      expect(chalk.gray).toHaveBeenCalledWith(
        '  122  s '
      );
    });

    it('returns execution time message', () => {
      expect(
        privateApi.time(testSpecificMocks.start, testSpecificMocks.end)
      ).toBe(
        chalk.gray()
      );
    });
  });

  describe('response', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'method').mockReturnValue('method');
      jest.spyOn(privateApi, 'status').mockReturnValue('status');
      jest.spyOn(privateApi, 'time').mockReturnValue('time');
      jest.spyOn(global.Date, 'now').mockReturnValue('current-time');
      jest.spyOn(console, 'log').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.data = {
        method: 'GET',
        startTime: 'req-start-time',
        uri: 'http://www.darkyndy.com/',
      };
      testSpecificMocks.res = {
        statusCode: 200,
      };
    });

    afterEach(() => {
      privateApi.method.mockClear();
      privateApi.status.mockClear();
      privateApi.time.mockClear();
      global.Date.now.mockClear();
      console.log.mockClear(); // eslint-disable-line no-console
    });
    afterAll(() => {
      privateApi.method.mockRestore();
      privateApi.status.mockRestore();
      privateApi.time.mockRestore();
      global.Date.now.mockRestore();
      console.log.mockRestore(); // eslint-disable-line no-console
    });

    it('prepares message for method name', () => {
      logger.response(testSpecificMocks.data, testSpecificMocks.res);

      expect(privateApi.method).toHaveBeenCalledWith(
        testSpecificMocks.data.method,
      );
    });

    it('prepares message for status code', () => {
      logger.response(testSpecificMocks.data, testSpecificMocks.res);

      expect(privateApi.status).toHaveBeenCalledWith(
        testSpecificMocks.res.statusCode,
      );
    });

    it('prepares message for execution time', () => {
      logger.response(testSpecificMocks.data, testSpecificMocks.res);

      expect(privateApi.time).toHaveBeenCalledWith(
        testSpecificMocks.data.startTime,
        global.Date.now(),
      );
    });

    it('logs message that contains method name, status code, execution time and uri', () => {
      logger.response(testSpecificMocks.data, testSpecificMocks.res);

      expect(console.log).toHaveBeenCalledWith( // eslint-disable-line no-console
        `${privateApi.method()}${privateApi.status()}${privateApi.time()}${testSpecificMocks.data.uri}`
      );
    });
  });

  describe('error', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'message').mockReturnValue('message');
    });
    beforeEach(() => {
      testSpecificMocks.message = 'message for logging';
      testSpecificMocks.category = 'group';
    });

    afterEach(() => {
      privateApi.message.mockClear();
    });
    afterAll(() => {
      privateApi.message.mockRestore();
    });

    it('prepares message for logging', () => {
      logger.error(testSpecificMocks.message, testSpecificMocks.category);

      expect(privateApi.message).toHaveBeenCalledWith(
        testSpecificMocks.message,
        testSpecificMocks.category,
        'error',
      );
    });
  });

  describe('success', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'message').mockReturnValue('message');
    });
    beforeEach(() => {
      testSpecificMocks.message = 'message for logging';
      testSpecificMocks.category = 'group';
    });

    afterEach(() => {
      privateApi.message.mockClear();
    });
    afterAll(() => {
      privateApi.message.mockRestore();
    });

    it('prepares message for logging', () => {
      logger.success(testSpecificMocks.message, testSpecificMocks.category);

      expect(privateApi.message).toHaveBeenCalledWith(
        testSpecificMocks.message,
        testSpecificMocks.category,
        'success',
      );
    });
  });

});
