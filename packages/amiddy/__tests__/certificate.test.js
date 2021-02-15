import fs from 'fs';
import selfsigned from 'selfsigned';

// testing file
import certificate, {privateApi} from '../src/certificate';


// mocks
jest.mock('selfsigned', () => (
  {
    generate: jest.fn().mockReturnValue(
      {
        cert: 'cert',
        private: 'private',
      }
    ),
  }
));


describe('server', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getAltName', () => {
    beforeEach(() => {
      testSpecificMocks.vhostName = 'darkyndy.example.com';
    });

    it('returns DNS name that will be used as value for altNames (use-case: sub-domain)', () => {
      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('*.example.com');
    });

    it('returns DNS name that will be used as value for altNames (use-case: domain)', () => {
      testSpecificMocks.vhostName = 'example.com';

      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('example.com');
    });

    it('returns DNS name that will be used as value for altNames (use-case: localhost)', () => {
      testSpecificMocks.vhostName = 'localhost';

      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('localhost');
    });

  });

  describe('generate', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getAltName').mockReturnValue('*.dns.name');
    });
    beforeEach(() => {
      testSpecificMocks.vhostName = 'darkyndy.example.com';
      testSpecificMocks.selfsignedConf = {
        attrs: [
          {
            name: 'commonName',
            value: 'darkyndy.com',
          },
        ],
        opts: {
          days: 365,
        },
      };
    });

    afterEach(() => {
      selfsigned.generate.mockClear();
      privateApi.getAltName.mockClear();
    });
    afterAll(() => {
      privateApi.getAltName.mockRestore();
    });

    it('generates self signed certificate using defaults when configuration is not provided', () => {
      certificate.generate(testSpecificMocks.vhostName);

      expect(
        selfsigned.generate
      ).toHaveBeenCalledWith(
        [
          {
            name: 'commonName',
            value: '*.dns.name'
          },
          {
            name: 'organizationName',
            value: 'amiddy Trust',
          },
        ],
        {
          algorithm: 'sha256',
          clientCertificate: true,
          clientCertificateCN: 'amiddy',
          days: 365,
          extensions: [
            {
              cA: false,
              critical: true,
              name: 'basicConstraints'
            },
            {
              critical: true,
              dataEncipherment: true,
              digitalSignature: true,
              keyCertSign: true,
              keyEncipherment: true,
              name: 'keyUsage',
              nonRepudiation: true,
            },
            {
              clientAuth: true,
              name: 'extKeyUsage',
              serverAuth: true,
            },
            {
              altNames: [
                {
                  type: 2,
                  value: '*.dns.name',
                },
              ],
              name: 'subjectAltName',
            },
            {
              name: 'subjectKeyIdentifier',
            },
            {
              authorityCertIssuer: true,
              keyIdentifier: true,
              name: 'authorityKeyIdentifier',
              serialNumber: true,
            },
          ],
          keySize: 2048,
        },
      );
    });

    it('generates self signed certificate using defaults when configuration is not provided', () => {
      certificate.generate(testSpecificMocks.vhostName);

      expect(
        privateApi.getAltName
      ).toHaveBeenCalledWith(
        testSpecificMocks.vhostName
      );
    });

    it('generates self signed certificate using configuration provided', () => {
      certificate.generate(testSpecificMocks.vhostName, testSpecificMocks.selfsignedConf);

      expect(
        selfsigned.generate
      ).toHaveBeenCalledWith(
        testSpecificMocks.selfsignedConf.attrs,
        testSpecificMocks.selfsignedConf.opts,
      );
    });

    it('returns self signed certificate', () => {
      expect(
        certificate.generate(testSpecificMocks.selfsignedConf)
      ).toEqual(
        selfsigned.generate()
      );
    });

  });

  describe('read', () => {
    beforeAll(() => {
      jest.spyOn(fs, 'readFileSync').mockReturnValue('fs.readFileSync');
    });
    beforeEach(() => {
      testSpecificMocks.config = {
        cert: 'file.crt',
        key: 'file.key',
      };
    });

    afterEach(() => {
      fs.readFileSync.mockClear();
    });
    afterAll(() => {
      fs.readFileSync.mockRestore();
    });

    it('returns an object with cert and key properties that contain each file content', () => {
      fs.readFileSync
        .mockReturnValueOnce('cert-file-content')
        .mockReturnValueOnce('key-file-content');
      expect(
        certificate.read(testSpecificMocks.config)
      ).toEqual({
        cert: 'cert-file-content',
        key: 'key-file-content',
      });
    });

    it('reads the content of cert & key file based on path from config', () => {
      certificate.read(testSpecificMocks.config);

      expect(
        fs.readFileSync.mock.calls
      ).toEqual(
        [
          [testSpecificMocks.config.cert],
          [testSpecificMocks.config.key],
        ]
      );
    });

    it('throws error when it fails to read the content of the cert file', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw 'cert-error';
      });

      expect(
        () => {
          certificate.read(testSpecificMocks.config);
        }
      ).toThrow(
        'cert-error'
      );
    });

    it('throws error when it fails to read the content of the key file', () => {
      fs.readFileSync
        .mockImplementationOnce(() => ('cert-file-content'))
        .mockImplementationOnce(() => {
          throw 'key-error';
        });

      expect(
        () => {
          certificate.read(testSpecificMocks.config);
        }
      ).toThrow(
        'key-error'
      );
    });

  });

});
