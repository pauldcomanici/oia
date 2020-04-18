// testing file
import options, {privateApi} from '../src/options';

// dependencies
// services
import loggingData from '../src/logging';
jest.mock('../src/logging');


describe('options.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getMatcher', () => {
    beforeEach(() => {
      testSpecificMocks.matcher = undefined;
      testSpecificMocks.matcherName = 'matcherName';
      testSpecificMocks.defaultMatcher = [
        'defaultMatcher',
        'anotherDefaultMatcher',
      ];
    });

    it('when matcher is an array with no item match => returns regular expression that will match everything', () => {
      testSpecificMocks.matcher = [];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(?:)/);
    });

    it('when matcher is an array with only one item => returns regular expression based on that item', () => {
      testSpecificMocks.matcher = [
        '.*.js$',
      ];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(.*.js$)/);
    });

    it('when matcher is an array with multiple items => returns regular expression based on every item, ignored falsy items', () => {
      testSpecificMocks.matcher = [
        '.*.js$',
        '.*.jsx$',
        '',
        '/src/js/',
        false,
      ];

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(.*.js$)|(.*.jsx$)|(\/src\/js\/)/);
    });

    it('when matcher is a string with value => returns regular expression based on that string', () => {
      testSpecificMocks.matcher = '.js';

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/.js/);
    });

    it('when matcher has falsy value (empty string) => returns regular expression based on defaults', () => {
      testSpecificMocks.matcher = '';

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(defaultMatcher)|(anotherDefaultMatcher)/);
    });

    it('when matcher has falsy value (empty string) => returns regular expression based on defaults (empty array if is not sent)', () => {
      testSpecificMocks.matcher = '';
      testSpecificMocks.defaultMatcher = undefined;

      expect(privateApi.getMatcher(
        testSpecificMocks.matcher,
        testSpecificMocks.matcherName,
        testSpecificMocks.defaultMatcher
      )).toEqual(/(?:)/);
    });

    it('when matcher has value that is not a string or array => throws error', () => {
      testSpecificMocks.matcher = {};

      expect(
        () => {
          privateApi.getMatcher(
            testSpecificMocks.matcher,
            testSpecificMocks.matcherName,
            testSpecificMocks.defaultMatcher
          );
        }
      ).toThrow('[babel-auto-logger-plugin] \'matcherName\' can be string or array with strings');
    });
  });

  describe('privateApi.getSourceMatcher', () => {
    it('returns an array with default source matcher (anything that ends with js or jsx)', () => {
      expect(privateApi.getSourceMatcher()).toEqual(
        [
          '.*js(x)?$',
        ]
      );
    });
  });

  describe('privateApi.getSourceExcludeMatcher', () => {
    it('returns an array with default source exclude matcher (anything that contains __mocks__, __tests__, __snapshots__, node_modules)', () => {
      expect(privateApi.getSourceExcludeMatcher()).toEqual(
        [
          '__fixtures__',
          '__mocks__',
          '__tests__',
          '__snapshots__',
          'node_modules',
        ]
      );
    });
  });

  describe('privateApi.getOutput', () => {
    beforeEach(() => {
      testSpecificMocks.settings = {
        argsAsObject: true,
        args: 'argsParam',
        name: 'nameParam',
        source: 'sourceParam',
        type: 'object',
      };
      testSpecificMocks.defaultOptions = {
        type: 'simple',
      };
      testSpecificMocks.defaultOptionsObject = {
        argsAsObject: false,
        args: 'args',
        name: 'name',
        source: 'source',
        type: 'object',
      };
    });

    it('returns default settings when nothing was provided', () => {
      expect(
        privateApi.getOutput()
      ).toEqual(
        testSpecificMocks.defaultOptions
      )
    });

    it('returns default settings when provided options is not an object', () => {
      testSpecificMocks.settings = 'string?';

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        testSpecificMocks.defaultOptions
      )
    });

    it('returns default settings when type is not valid', () => {
      testSpecificMocks.settings.type =  'not-supported';

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        testSpecificMocks.defaultOptions
      )
    });

    it('returns default settings when type is `simple`', () => {
      testSpecificMocks.settings.type = 'simple';

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        testSpecificMocks.defaultOptions
      )
    });

    it('returns default settings for type as `object` when only type as `object` is provided', () => {
      expect(
        privateApi.getOutput({
          type: 'object'
        })
      ).toEqual(
        testSpecificMocks.defaultOptionsObject
      )
    });

    it('returns settings for type as `object` by merging what was provided with defaults (no config for `args`)', () => {
      testSpecificMocks.settings.args = undefined;

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        {
          ...testSpecificMocks.settings,
          args: 'args',
        }
      )
    });

    it('returns settings for type as `object` by merging what was provided with defaults (no config for `name`)', () => {
      testSpecificMocks.settings.name = undefined;

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        {
          ...testSpecificMocks.settings,
          name: 'name',
        }
      )
    });

    it('returns settings for type as `object` by merging what was provided with defaults (no config for `source`)', () => {
      testSpecificMocks.settings.source = undefined;

      expect(
        privateApi.getOutput(testSpecificMocks.settings)
      ).toEqual(
        {
          ...testSpecificMocks.settings,
          source: 'source',
        }
      )
    });
  });

  describe('prepare', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getMatcher').mockReturnValue('getMatcher');
      jest.spyOn(privateApi, 'getSourceMatcher').mockReturnValue('getSourceMatcher');
      jest.spyOn(privateApi, 'getSourceExcludeMatcher').mockReturnValue('getSourceExcludeMatcher');
      jest.spyOn(privateApi, 'getOutput').mockReturnValue('getOutput');
      jest.spyOn(loggingData, 'getOptions').mockReturnValue('loggingData::loggingData');
    });
    beforeEach(() => {
      testSpecificMocks.receivedOptions = {
        loggingData: {
          source: '',
        },
        output: {
          type: 'simple',
        },
        sourceExcludeMatcher: 'sourceExcludeMatcher',
        sourceMatcher: 'sourceMatcher',
      };
    });
    afterEach(() => {
      privateApi.getMatcher.mockClear();
      privateApi.getSourceMatcher.mockClear();
      privateApi.getSourceExcludeMatcher.mockClear();
      privateApi.getOutput.mockClear();
      loggingData.getOptions.mockClear();
    });
    afterAll(() => {
      privateApi.getMatcher.mockRestore();
      privateApi.getSourceMatcher.mockRestore();
      privateApi.getSourceExcludeMatcher.mockRestore();
      privateApi.getOutput.mockRestore();
      loggingData.getOptions.mockRestore();
    });

    it('retrieves default value for `sourceMatcher` option by calling `privateApi.getSourceMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getSourceMatcher).toHaveBeenCalledWith();
    });

    it('prepares `sourceMatcher` option by calling `privateApi.getMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getMatcher.mock.calls[0]).toEqual(
        [
          testSpecificMocks.receivedOptions.sourceMatcher,
          'sourceMatcher',
          privateApi.getSourceMatcher(),
        ]
      );
    });

    it('retrieves default value for `sourceExcludeMatcher` option by calling `privateApi.getSourceExcludeMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getSourceExcludeMatcher).toHaveBeenCalledWith();
    });

    it('prepares `sourceExcludeMatcher` option by calling `privateApi.getMatcher`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getMatcher.mock.calls[1]).toEqual(
        [
          testSpecificMocks.receivedOptions.sourceExcludeMatcher,
          'sourceExcludeMatcher',
          privateApi.getSourceExcludeMatcher(),
        ]
      );
    });

    it('prepares `output` option by calling `privateApi.getOutput`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(privateApi.getOutput.mock.calls).toEqual(
        [
          [
            testSpecificMocks.receivedOptions.output,
          ],
        ]
      );
    });

    it('prepares `loggingData` option by calling `loggingData.getOptions`', () => {
      options.prepare(testSpecificMocks.receivedOptions);

      expect(loggingData.getOptions).toHaveBeenCalledWith(
        testSpecificMocks.receivedOptions.loggingData
      );
    });

    it('returns object with valid options after processing', () => {
      expect(
        options.prepare(testSpecificMocks.receivedOptions)
      ).toEqual({
        loggingData: loggingData.getOptions(),
        output: privateApi.getOutput(),
        sourceExcludeMatcher: privateApi.getMatcher(),
        sourceMatcher: privateApi.getMatcher(),
      });
    });

  });

});
