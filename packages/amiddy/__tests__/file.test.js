
import path from 'path';

// testing file
import file, {privateApi} from '../src/file';

// mocks
jest.mock('path', () => (
  {
    isAbsolute: jest.fn().mockReturnValue(true),
    resolve: jest.fn().mockReturnValue('path::resolve'),
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
