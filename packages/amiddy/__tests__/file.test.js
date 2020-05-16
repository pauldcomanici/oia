
import fs from 'fs';
import path from 'path';

// testing file
import file, {privateApi} from '../src/file';

import logger from '../src/logger';

// mocks
jest.mock('path', () => (
  {
    isAbsolute: jest.fn().mockReturnValue(true),
    resolve: jest.fn().mockReturnValue('path::resolve'),
  }
));
jest.mock('../src/logger', () => (
  {
    error: jest.fn(),
  }
));


describe('file', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
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

  describe('privateApi.onSaveCb', () => {
    beforeEach(() => {
      testSpecificMocks.err = {
        message: 'We have error',
      };
    });

    afterEach(() => {
      logger.error.mockClear();
    });

    it('logs error if we have it', () => {
      privateApi.onSaveCb(testSpecificMocks.err);

      expect(logger.error).toHaveBeenCalledWith(
        testSpecificMocks.err.message,
        'file-write'
      );
    });

    it('nothing happens if error has falsy value', () => {
      testSpecificMocks.err = null;
      privateApi.onSaveCb(testSpecificMocks.err);

      expect(logger.error).not.toHaveBeenCalled();
    });


  });

  describe('write', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'onSaveCb').mockReturnValue(undefined);
      jest.spyOn(fs, 'writeFile').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.filePath = '__tests__/__fixtures__/write-dir/file.json';
      testSpecificMocks.content = '{content: 0}';
    });

    afterEach(() => {
      privateApi.onSaveCb.mockClear();
      fs.writeFile.mockClear();
    });
    afterAll(() => {
      privateApi.onSaveCb.mockRestore();
      fs.writeFile.mockRestore();
    });

    it('sanitizes file path', () => {
      testSpecificMocks.filePath = 'path/to//file';
      file.write(testSpecificMocks.filePath, testSpecificMocks.content);

      expect(fs.writeFile).toHaveBeenCalledWith(
        'path/to/file',
        testSpecificMocks.content,
        privateApi.onSaveCb
      );
    });

    it('writes file content to disk', () => {
      file.write(testSpecificMocks.filePath, testSpecificMocks.content);

      expect(fs.writeFile).toHaveBeenCalledWith(
        testSpecificMocks.filePath,
        testSpecificMocks.content,
        privateApi.onSaveCb
      );
    });

  });

  describe('read', () => {

    it('returns content of the file as string when file exists', () => {
      expect(file.read('__tests__/__fixtures__/config.json')).toMatchSnapshot();
    });

    it('throws error when file does not exists', () => {
      expect(() => {
        file.read('__tests__/__fixtures__/noap.json');
      }).toThrowErrorMatchingSnapshot();
    });

  });

  describe('getAbsolutePath', () => {
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
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        process.cwd
      ).toHaveBeenCalledWith();
    });

    it('determines if provided path is absolute', () => {
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.isAbsolute
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve
      );
    });

    it('tries to resolve path when is not absolute', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.resolve
      ).toHaveBeenCalledWith(
        'process::cwd',
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is absolute)', () => {
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        'path::resolve',
      );
    });

    it('returns absolute path when it represents a file (path is absolute)', () => {
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('returns absolute path when it represents a file (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      file.getAbsolutePath(testSpecificMocks.pathToResolve);

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
          file.getAbsolutePath(testSpecificMocks.pathToResolve);
        }
      ).toThrowErrorMatchingSnapshot();
    });

  });

});
