import fs from 'fs';

// tested
import setup, {privateApi} from '../../src/setup';

import logger from '../../src/logger';

// mocks
jest.mock('fs');
jest.mock('../../src/logger', () => (
  {
    error: jest.fn(),
  }
));

describe('setup', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.createRecorderDirCb', () => {
    beforeEach(() => {
      testSpecificMocks.config = {
        options: {
          recorder: {
            enabled: true,
            path: 'something',
          },
        }
      };
      testSpecificMocks.err = {
        code: 'FAIL',
        message: 'error message',
      };
    });

    afterEach(() => {
      logger.error.mockClear();
    });

    it('logs errors when there is an error different from `already exists`', () => {
      privateApi.createRecorderDirCb(testSpecificMocks.config)(testSpecificMocks.err);

      expect(
        logger.error.mock.calls
      ).toEqual(
        [
          [
            testSpecificMocks.err.message,
            'setup',
          ],
          [
            'Disabling recording as there was an error while creating directory',
            'setup',
          ],
        ]
      );
    });

    it('disables recording when there is an error different from `already exists`', () => {
      privateApi.createRecorderDirCb(testSpecificMocks.config)(testSpecificMocks.err);

      expect(
        testSpecificMocks.config.options.recorder.enabled
      ).toBe(false);
    });

    it('nothing happens if error has falsy value', () => {
      testSpecificMocks.err = null;
      privateApi.createRecorderDirCb(testSpecificMocks.config)(testSpecificMocks.err);

      expect(
        logger.error
      ).not.toHaveBeenCalled();
    });

    it('nothing happens if error code is `EEXIST` (folder already exists', () => {
      testSpecificMocks.err.code = 'EEXIST';
      privateApi.createRecorderDirCb(testSpecificMocks.config)(testSpecificMocks.err);

      expect(
        logger.error
      ).not.toHaveBeenCalled();
    });

  });

  describe('privateApi.createRecorderDir', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'createRecorderDirCb').mockReturnValue('createRecorderDirCb');

    });
    beforeEach(() => {
      testSpecificMocks.config = {
        options: {
          recorder: {
            enabled: true,
            path: 'something',
          },
        }
      };
    });

    afterEach(() => {
      privateApi.createRecorderDirCb.mockClear();
      fs.mkdir.mockClear();
    });
    afterAll(() => {
      privateApi.createRecorderDirCb.mockRestore();
    });

    it('prepares callback function for fs.mkdir only if recording is enabled and path is not empty', () => {
      privateApi.createRecorderDir(testSpecificMocks.config);

      expect(
        privateApi.createRecorderDirCb
      ).toHaveBeenCalledWith(
        testSpecificMocks.config
      );
    });

    it('creates recorder directory only if recording is enabled and path is not empty', () => {
      privateApi.createRecorderDir(testSpecificMocks.config);

      expect(
        fs.mkdir
      ).toHaveBeenCalledWith(
        testSpecificMocks.config.options.recorder.path,
        {
          recursive: true,
        },
        privateApi.createRecorderDirCb()
      );
    });

    it('nothing happens if recording is disabled', () => {
      testSpecificMocks.config.options.recorder.enabled = false;
      privateApi.createRecorderDir(testSpecificMocks.config);

      expect(
        fs.mkdir
      ).not.toHaveBeenCalled();
    });

    it('nothing happens if recording directory is empty', () => {
      testSpecificMocks.config.options.recorder.path = '';
      privateApi.createRecorderDir(testSpecificMocks.config);

      expect(
        fs.mkdir
      ).not.toHaveBeenCalled();
    });
  });

  describe('init', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'createRecorderDir').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.config = {
        options: {
          recorder: {},
        }
      };
    });

    afterEach(() => {
      privateApi.createRecorderDir.mockClear();
    });
    afterAll(() => {
      privateApi.createRecorderDir.mockRestore();
    });

    it('creates the directory for recording', () => {
      setup.init(testSpecificMocks.config);

      expect(
        privateApi.createRecorderDir
      ).toHaveBeenCalledWith(
        testSpecificMocks.config
      );
    });
  });
});

