
import http from 'http';
import https from 'https';

import express from 'express';

// testing file
import server, {privateApi} from '../src/server.js';

import logger from '../src/logger.js';
import certificate from '../src/certificate.js';
import proxy from '../src/proxy/index.js';


// mocks
jest.mock('express', () => (
  jest.fn().mockReturnValue(
    {
      disable: jest.fn(),
      use: jest.fn(),
    }
  )
));
jest.mock('http', () => (
  {
    createServer: jest.fn().mockReturnValue(
      {
        listen: jest.fn(),
      }
    ),
  }
));
jest.mock('https', () => (
  {
    createServer: jest.fn().mockReturnValue(
      {
        listen: jest.fn(),
      }
    ),
  }
));

jest.mock('../src/logger', () => (
  {
    success: jest.fn(),
  }
));
jest.mock('../src/certificate', () => (
  {
    generate: jest.fn().mockReturnValue(
      {
        cert: 'cert',
        private: 'private',
      }
    ),
    read: jest.fn().mockReturnValue(
      {
        cert: 'cert-content',
        key: 'key-content',
      }
    ),
  }
));
jest.mock('../src/proxy/index', () => (
  {
    create: jest.fn().mockReturnValue(
      'vhost'
    ),
  }
));


describe('server', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.listen', () => {
    beforeEach(() => {
      testSpecificMocks.message = 'Open: http://darkyndy.com:80';
    });

    afterEach(() => {
      logger.success.mockClear();
    });

    it('logs success messages', () => {
      privateApi.listen(testSpecificMocks.message)();

      expect(
        logger.success.mock.calls
      ).toEqual(
        [
          [''],
          ['Started', 'server-start'],
          [testSpecificMocks.message, 'server-start'],
          [''],
        ]
      );
    });
  });

  describe('create', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'listen').mockReturnValue('listen-fn');
    });
    beforeEach(() => {
      testSpecificMocks.config = {
        selfsigned: {
          attrs: [
            {
              name: 'commonName',
              value: 'darkyndy.com',
            },
          ],
          opts: {
            days: 365,
          },
        },
        vhost: {
          name: 'darkyndy.com',
          port: 80,
        },
      };
    });

    afterEach(() => {
      express.mockClear();
      express().disable.mockClear();
      express().use.mockClear();
      http.createServer.mockClear();
      http.createServer().listen.mockClear();
      https.createServer.mockClear();
      https.createServer().listen.mockClear();

      certificate.generate.mockClear();
      proxy.create.mockClear();
      privateApi.listen.mockClear();
    });
    afterAll(() => {
      privateApi.listen.mockRestore();
    });

    it('creates express instance', () => {
      server.create(testSpecificMocks.config);

      expect(express).toHaveBeenCalledWith();
    });

    it('uses certificate files when vhost uses https protocol and ssl files are provided', () => {
      testSpecificMocks.config.vhost.https = true;
      testSpecificMocks.config.sslFiles = {
        cert: 'path-to-cert-file',
        key: 'path-to-key-file',
      };
      server.create(testSpecificMocks.config);

      expect(certificate.read).toHaveBeenCalledWith(
        testSpecificMocks.config.sslFiles
      );
    });

    it('generates certificate when vhost uses https protocol', () => {
      testSpecificMocks.config.vhost.https = true;
      server.create(testSpecificMocks.config);

      expect(certificate.generate).toHaveBeenCalledWith(
        testSpecificMocks.config.vhost.name,
        testSpecificMocks.config.selfsigned
      );
    });

    it('certificate is not generated when vhost uses http protocol', () => {
      server.create(testSpecificMocks.config);

      expect(certificate.generate).not.toHaveBeenCalled();
    });

    it('creates proxy with ssl that will be used by express when vhost uses secure protocol', () => {
      testSpecificMocks.config.vhost.https = true;
      server.create(testSpecificMocks.config);

      expect(proxy.create).toHaveBeenCalledWith(
        testSpecificMocks.config,
        certificate.generate(),
      );
    });

    it('creates proxy without ssl that will be used by express when vhost uses non-secure protocol', () => {
      server.create(testSpecificMocks.config);

      expect(proxy.create).toHaveBeenCalledWith(
        testSpecificMocks.config,
        null,
      );
    });

    it('uses proxy created by express app', () => {
      server.create(testSpecificMocks.config);

      expect(express().use).toHaveBeenCalledWith(
        proxy.create(),
      );
    });

    it('removes `x-powered-by` header', () => {
      server.create(testSpecificMocks.config);

      expect(express().disable).toHaveBeenCalledWith(
        'x-powered-by',
      );
    });

    it('creates secure http server when vhost uses secure connection (ssl.key used as key)', () => {
      testSpecificMocks.config.vhost.https = true;
      testSpecificMocks.ssl = {
        cert: 'cert-content',
        key: 'key-content',
      };
      certificate.generate.mockReturnValueOnce(testSpecificMocks.ssl);


      server.create(testSpecificMocks.config);

      expect(https.createServer).toHaveBeenCalledWith(
        testSpecificMocks.ssl,
        express()
      );
    });

    it('creates secure http server when vhost uses secure connection (ssl.private used as key)', () => {
      testSpecificMocks.config.vhost.https = true;
      server.create(testSpecificMocks.config);
      testSpecificMocks.ssl = certificate.generate();

      expect(https.createServer).toHaveBeenCalledWith(
        {
          cert: testSpecificMocks.ssl.cert,
          key: testSpecificMocks.ssl['private'],
        },
        express()
      );
    });

    it('creates non-secure http server when vhost uses non-secure connection', () => {
      server.create(testSpecificMocks.config);

      expect(http.createServer).toHaveBeenCalledWith(
        express()
      );
    });

    it('prepares the function for listening to server', () => {
      server.create(testSpecificMocks.config);

      expect(privateApi.listen).toHaveBeenCalledWith(
        'Open: http://darkyndy.com:80'
      );
    });

    it('listens to http server (secure, as we are using https)', () => {
      testSpecificMocks.config.vhost.https = true;
      server.create(testSpecificMocks.config);

      expect(https.createServer().listen).toHaveBeenCalledWith(
        testSpecificMocks.config.vhost.port,
        'listen-fn',
      );
    });

    it('listens to http server (non-secure, as we are using http)', () => {
      server.create(testSpecificMocks.config);

      expect(http.createServer().listen).toHaveBeenCalledWith(
        testSpecificMocks.config.vhost.port,
        'listen-fn',
      );
    });

  });
});
