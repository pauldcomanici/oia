
import micromatch from 'micromatch';
import mime from 'mime-types';

// testing file
import proxyRecorder, {privateApi} from '../../src/proxy/recorder';


import file from '../../src/file';
import proxyUtils from '../../src/proxy/utils';

// mocks
jest.mock('micromatch', () => (
  {
    isMatch: jest.fn().mockReturnValue(false),
  }
));
jest.mock('mime-types', () => (
  {
    extension: jest.fn().mockReturnValue('json'),
  }
));
jest.mock('../../src/file', () => (
  {
    write: jest.fn(),
  }
));
jest.mock('../../src/proxy/utils', () => (
  {
    getDependency: jest.fn().mockReturnValue('proxyUtils::getDependency'),
  }
));

describe('proxy-recorder', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });


  describe('privateApi.getFileName', () => {
    beforeEach(() => {
      testSpecificMocks.pattern = '{METHOD}-{PATH}-{STATUS}.{EXT}';
      testSpecificMocks.data = {
        ext: 'json',
        method: 'GET',
        path: '/path/to/something',
        status: 200,
      };
    });

    it('when path received has query data it will be removed', () => {
      testSpecificMocks.pattern = '{PATH}';
      testSpecificMocks.data.path = '/path/to/something?and-what-is-here-is-ignored';

      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('_path_to_something');
    });

    it('when path received has anchor data it will be removed', () => {
      testSpecificMocks.pattern = '{PATH}';
      testSpecificMocks.data.path = '/path/to/something#and-what-is-here-is-ignored';

      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('_path_to_something');
    });

    it('when path received has anchor & query data it will be removed (anchor first)', () => {
      testSpecificMocks.pattern = '{PATH}';
      testSpecificMocks.data.path = '/path/to/something?and-what-is-here-is-ignored#also-with-query';

      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('_path_to_something');
    });

    it('when path received has anchor & query data it will be removed (query first)', () => {
      testSpecificMocks.pattern = '{PATH}';
      testSpecificMocks.data.path = '/path/to/something#and-what-is-here-is-ignored?also-with-query';

      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('_path_to_something');
    });

    it('returns string where all tokens are replaced', () => {
      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('GET-_path_to_something-200.json');
    });

    it('returns string where nothing is replaced as we do not have any token', () => {
      testSpecificMocks.pattern = 'hardcoded.txt';

      expect(
        privateApi.getFileName(testSpecificMocks.pattern, testSpecificMocks.data)
      ).toBe('hardcoded.txt');
    });

  });


  describe('privateApi.saveToFile', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getFileName').mockReturnValue('fileName.json');
    });
    beforeEach(() => {
      testSpecificMocks.body = '{content: 0}';
      testSpecificMocks.proxyRes = {
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
        req: {
          method: 'GET',
          path: '/path/to/resource',
        },
        statusCode: 200,
      };
      testSpecificMocks.config = {
        deps: [
          {
            name: 'example.com',
          }
        ],
        options: {
          recorder: {
            fileNamePattern: '{METHOD}-{PATH}.{EXT}',
            ignorePatterns: ['**favicon*'],
            path: '__amiddy__/records',
          },
        },
      };
    });

    afterEach(() => {
      proxyUtils.getDependency.mockClear();
      micromatch.isMatch.mockClear();
      mime.extension.mockClear();
      privateApi.getFileName.mockClear();
      file.write.mockClear();
    });
    afterAll(() => {
      privateApi.getFileName.mockRestore();
    });

    it('determines if we should not save this response if the path is resolved from source (not dependency)', () => {
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        proxyUtils.getDependency
      ).toHaveBeenCalledWith(
        testSpecificMocks.config.deps,
        testSpecificMocks.proxyRes.req.path
      );
    });

    it('determines if we should not save this response if the path is from dependency but may be in the list of ignored paths', () => {
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        micromatch.isMatch
      ).toHaveBeenCalledWith(
        testSpecificMocks.proxyRes.req.path,
        testSpecificMocks.config.options.recorder.ignorePatterns,
        {contains: true}
      );
    });

    it('determines if we should not save this response if the path is from dependency but may be in the list of ignored paths (ignorePatterns has falsy value)', () => {
      testSpecificMocks.config.options.recorder.ignorePatterns = null;
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        micromatch.isMatch
      ).toHaveBeenCalledWith(
        testSpecificMocks.proxyRes.req.path,
        [],
        {contains: true}
      );
    });

    it('determines extension for the file based on content-type header if we should save to file', () => {
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        mime.extension
      ).toHaveBeenCalledWith(
        testSpecificMocks.proxyRes.headers['content-type']
      );
    });

    it('determines file name if we should save to file', () => {
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        privateApi.getFileName
      ).toHaveBeenCalledWith(
        testSpecificMocks.config.options.recorder.fileNamePattern,
        {
          ext: 'json', // response from mime.extension
          method: testSpecificMocks.proxyRes.req.method,
          path: testSpecificMocks.proxyRes.req.path,
          status: testSpecificMocks.proxyRes.statusCode,
        }
      );
    });

    it('writes content to file if we should save to file (base path is defined)', () => {
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        file.write
      ).toHaveBeenCalledWith(
        '__amiddy__/records/fileName.json',
        testSpecificMocks.body
      );
    });

    it('writes content to file if we should save to file (base path is not defined)', () => {
      testSpecificMocks.config.options.recorder.path = '';
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        file.write
      ).toHaveBeenCalledWith(
        'fileName.json',
        testSpecificMocks.body
      );
    });

    it('does not check ignore patterns if the request was proxied from source', () => {
      proxyUtils.getDependency.mockReturnValueOnce(undefined);
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        micromatch.isMatch
      ).not.toHaveBeenCalled();
    });

    it('does not save response if the request was proxied from source', () => {
      proxyUtils.getDependency.mockReturnValueOnce(undefined);
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        file.write
      ).not.toHaveBeenCalled();
    });

    it('does not save response if the path is in the ignore patterns', () => {
      micromatch.isMatch.mockReturnValueOnce(true);
      privateApi.saveToFile(testSpecificMocks.body, testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(
        file.write
      ).not.toHaveBeenCalled();
    });

  });

  describe('saveResponse', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'saveToFile').mockReturnValue(undefined);
    });
    beforeEach(() => {
      // this allows to simulate events
      testSpecificMocks.proxyResEvt = {};

      testSpecificMocks.proxyRes = {
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
        on: jest.fn().mockImplementation(
          (evtName, evtFn) => {
            testSpecificMocks.proxyResEvt[evtName] = evtFn;
          }
        ),
        req: {
          method: 'GET',
          path: '/path/to/resource',
        },
        statusCode: 200,
      };
      testSpecificMocks.config = {
        deps: [
          {
            name: 'example.com',
          }
        ],
        options: {
          recorder: {
            enabled: true,
            fileNamePattern: '{METHOD}-{PATH}.{EXT}',
            ignorePatterns: ['**favicon*'],
            path: '__amiddy__/records',
          },
        },
      };
    });

    afterEach(() => {
      privateApi.saveToFile.mockClear();
    });
    afterAll(() => {
      privateApi.saveToFile.mockRestore();
    });

    it('listens to data & end event on proxyRes if recorder is enabled', () => {
      proxyRecorder.saveResponse(testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(testSpecificMocks.proxyRes.on.mock.calls).toEqual(
        [
          [
            'data',
            expect.any(Function),
          ],
          [
            'end',
            expect.any(Function),
          ],
        ]
      );
    });

    it('response body is not saved to file until end event is triggered (recorder is enabled)', () => {
      proxyRecorder.saveResponse(testSpecificMocks.proxyRes, testSpecificMocks.config);
      testSpecificMocks.proxyResEvt.data(Buffer.from('data-0'));
      testSpecificMocks.proxyResEvt.data(Buffer.from('data-1'));

      expect(privateApi.saveToFile).not.toHaveBeenCalled();
    });

    it('response body is saved to file when end event is triggered (recorder is enabled)', () => {
      proxyRecorder.saveResponse(testSpecificMocks.proxyRes, testSpecificMocks.config);
      testSpecificMocks.proxyResEvt.data(Buffer.from('data-0'));
      testSpecificMocks.proxyResEvt.data(Buffer.from('data-1'));
      testSpecificMocks.proxyResEvt.end();

      expect(privateApi.saveToFile).toHaveBeenCalledWith(
        'data-0data-1',
        testSpecificMocks.proxyRes,
        testSpecificMocks.config
      );
    });

    it('does not listen to any event on proxyRes if recorder is not enabled', () => {
      testSpecificMocks.config.options.recorder.enabled = false;
      proxyRecorder.saveResponse(testSpecificMocks.proxyRes, testSpecificMocks.config);

      expect(testSpecificMocks.proxyRes.on).not.toHaveBeenCalled();
    });

  });

});
