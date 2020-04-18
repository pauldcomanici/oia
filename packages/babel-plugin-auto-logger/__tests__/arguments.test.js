import * as types from '@babel/types';

// testing file
import loggingArguments, {privateApi} from '../src/arguments';

// constants
import consts from '../src/constants';


jest.mock('@babel/types');


describe('arguments.js', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getDefault', () => {
    beforeAll(() => {
      jest.spyOn(types, 'stringLiteral');
    });
    beforeEach(() => {
      types.stringLiteral
        .mockReturnValueOnce('firstArg')
        .mockReturnValueOnce('name')
        .mockReturnValue('stringLiteral');

      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: 'functionName',
        source: 'file-name.js',
      };
    });
    afterEach(() => {
      types.stringLiteral.mockClear();
    });
    afterAll(() => {
      types.stringLiteral.mockRestore();
    });

    it('prepares string literals that will be used as arguments for the logger method, the first logger argument -> file name with line and column; and second time for the second argument -> method name', () => {
      privateApi.getDefault(testSpecificMocks.knownData);

      expect(types.stringLiteral.mock.calls).toEqual(
        [
          [
            '[file-name.js:22:11]',
          ],
          [
            testSpecificMocks.knownData.name,
          ]
        ]
      );
    });

    it('returns an array with 2 items ([file:line:column], functionName)', () => {
      expect(privateApi.getDefault(
        testSpecificMocks.knownData
      )).toEqual(
        [
          'firstArg',
          'name',
        ]
      );
    });
  });

  describe('privateApi.getFunctionArguments', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isIdentifier').mockReturnValue(false);
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
    });
    beforeEach(() => {

      testSpecificMocks.path = {
        node: {
          params: [
            {
              name: 'identifier1',
            },
            {
              name: 'identifier2',
            },
            {
              name: 'identifier3',
            },
          ],
        },
      };

    });
    afterEach(() => {
      types.isIdentifier.mockClear();
      types.identifier.mockClear();
    });
    afterAll(() => {
      types.isIdentifier.mockRestore();
      types.identifier.mockRestore();
    });

    it('when the node does not have params => returns an empty array', () => {
      testSpecificMocks.path.node = {};

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual([]);
    });

    it('when the path does not have node => returns an empty array', () => {
      testSpecificMocks.path = {};

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual([]);
    });

    it('when the node has params => returns an array with every argument that is an identifier', () => {
      types.isIdentifier
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      types.identifier
        .mockReturnValueOnce('identifier1')
        .mockReturnValueOnce('identifier3');

      expect(privateApi.getFunctionArguments(testSpecificMocks.path)).toEqual(
        [
          'identifier1',
          'identifier3',
        ]
      );
    });

  });

  describe('privateApi.getFunction', () => {
    beforeAll(() => {
      jest.spyOn(types, 'isCatchClause').mockReturnValue(false);
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
      jest.spyOn(privateApi, 'getFunctionArguments').mockReturnValue([
        'reason',
        'secondArg',
      ]);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {
          param: {
            name: 'ex',
          },
        },
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: consts.MEMBER_EXPRESSION_CATCH,
      };
    });
    afterEach(() => {
      types.isCatchClause.mockClear();
      types.identifier.mockClear();
      privateApi.getFunctionArguments.mockClear();
    });
    afterAll(() => {
      types.isCatchClause.mockRestore();
      types.identifier.mockRestore();
      privateApi.getFunctionArguments.mockRestore();
    });

    it('determines if the path is from catch clause by calling `types.isCatchClause`', () => {
      privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.isCatchClause).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path is from a catch clause => adds exception as argument for logger by calling `types.identifier` with identifier name', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.identifier).toHaveBeenCalledWith(
        testSpecificMocks.path.node.param.name
      );
    });

    it('if the path is from a catch clause => returns an array with the exception as identifier', () => {
      types.isCatchClause.mockReturnValueOnce(true);

      expect(privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual(
        [
          'identifier',
        ]
      );
    });

    it('if the path is not from a catch clause and name from knownData does not represent catch member expression => it will not determine function arguments (does not call `privateApi.getFunctionArguments`)', () => {
      testSpecificMocks.knownData = 'NOT_CATCH_MEMBER_EXPRESSION';

      privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(privateApi.getFunctionArguments).not.toBeCalled();
    });

    it('if the path is not from a catch clause and name from knownData does not represent catch member expression => returns empty array', () => {
      testSpecificMocks.knownData = 'NOT_CATCH_MEMBER_EXPRESSION';

      expect(privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual([]);
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => determines function arguments by calling `privateApi.getFunctionArguments`', () => {
      privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(privateApi.getFunctionArguments).toHaveBeenCalledWith(
        testSpecificMocks.path
      );
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => prepares logging arguments by calling `types.identifier` for every argument of the function', () => {
      privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData);

      expect(types.identifier.mock.calls).toEqual(
        [
          [
            'reason',
          ],
          [
            'secondArg',
          ]
        ]
      );
    });

    it('if the path is not from a catch clause and name from knownData represents catch member expression => returns an array with identifiers for every argument of the function', () => {
      expect(privateApi.getFunction(testSpecificMocks.path, testSpecificMocks.knownData)).toEqual(
        [
          'identifier',
          'identifier',
        ]
      );
    });

  });

  describe('privateApi.getArgsForObject', () => {
    beforeAll(() => {
      jest.spyOn(types, 'arrayExpression').mockReturnValue('arrayExpression');
      jest.spyOn(types, 'objectProperty').mockReturnValue('objectProperty');
      jest.spyOn(types, 'objectExpression').mockReturnValue('objectExpression');
    });
    beforeEach(() => {
      types.objectProperty
        .mockReturnValueOnce('objectPropertyFirst')
        .mockReturnValueOnce('objectPropertySecond');

      testSpecificMocks.state = {
        file: {},
        babelPluginLoggerSettings: {
          output: {
            args: 'argsParam',
            argsAsObject: true,
            name: 'nameParam',
            type: 'object',
            source: 'sourceParam',
          },
        },
      };
      testSpecificMocks.otherArgs = [
        'arg1',
        'arg2'
      ];
    });
    afterEach(() => {
      types.arrayExpression.mockClear();
      types.objectProperty.mockClear();
      types.objectExpression.mockClear();
    });
    afterAll(() => {
      types.arrayExpression.mockRestore();
      types.objectProperty.mockRestore();
      types.objectExpression.mockRestore();
    });

    it('returns undefined when we do not have otherArgs', () => {
      testSpecificMocks.otherArgs = [];
      expect(
        privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs)
      ).toEqual(undefined);
    });

    it('prepares arrayExpression when arguments value should be an array', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.output.argsAsObject = false;
      privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs);

      expect(
        types.arrayExpression.mock.calls
      ).toEqual([
        [
          testSpecificMocks.otherArgs,
        ]
      ]);
    });

    it('returns arrayExpression when arguments value should be an array', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.output.argsAsObject = false;

      expect(
        privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs)
      ).toEqual(
        'arrayExpression'
      );
    });

    it('prepares object properties when arguments value should be an object', () => {
      privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs);

      expect(
        types.objectProperty.mock.calls
      ).toEqual(
        [
          [
            'arg1',
            'arg1',
          ],
          [
            'arg2',
            'arg2',
          ],
        ]
      );
    });

    it('prepares object expression when arguments value should be an object', () => {
      privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs);

      expect(
        types.objectExpression.mock.calls
      ).toEqual(
        [
          [
            [
              'objectPropertyFirst',
              'objectPropertySecond',
            ],
          ],
        ]
      );
    });

    it('returns object expression when arguments value should be an object', () => {

      expect(
      privateApi.getArgsForObject(testSpecificMocks.state, testSpecificMocks.otherArgs)
      ).toEqual(
        'objectExpression'
      );
    });

  });

  describe('privateApi.getForObject', () => {
    beforeAll(() => {
      jest.spyOn(types, 'objectExpression').mockReturnValue('objectExpression');
      jest.spyOn(types, 'objectProperty').mockReturnValue('objectProperty');
      jest.spyOn(types, 'identifier').mockReturnValue('identifier');
      jest.spyOn(privateApi, 'getArgsForObject').mockReturnValue('argsForObject');
    });
    beforeEach(() => {
      types.objectProperty
        .mockReturnValueOnce('sourceObjProperty')
        .mockReturnValueOnce('nameObjProperty')
        .mockReturnValueOnce('argsObjProperty');
      types.identifier
        .mockReturnValueOnce('sourceIdentifier')
        .mockReturnValueOnce('nameIdentifier')
        .mockReturnValueOnce('argsIdentifier');


      testSpecificMocks.state = {
        file: {},
        babelPluginLoggerSettings: {
          output: {
            args: 'argsParam',
            argsAsObject: true,
            name: 'nameParam',
            type: 'object',
            source: 'sourceParam',
          },
        },
      };
      testSpecificMocks.defaultArgs = ['source-path', 'function-name'];
      testSpecificMocks.otherArgs = ['arg1', 'arg2'];
    });
    afterEach(() => {
      types.objectExpression.mockClear();
      types.objectProperty.mockClear();
      types.identifier.mockClear();
      privateApi.getArgsForObject.mockClear();
    });
    afterAll(() => {
      types.objectExpression.mockRestore();
      types.objectProperty.mockRestore();
      types.identifier.mockRestore();
      privateApi.getArgsForObject.mockRestore();
    });

    it('prepares identifier for source', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.identifier.mock.calls[0]
      ).toEqual([
        testSpecificMocks.state.babelPluginLoggerSettings.output.source,
      ]);
    });

    it('prepares object property for source', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.objectProperty.mock.calls[0]
      ).toEqual([
        'sourceIdentifier',
        testSpecificMocks.defaultArgs[0]
      ]);
    });

    it('prepares identifier for name', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.identifier.mock.calls[1]
      ).toEqual([
        testSpecificMocks.state.babelPluginLoggerSettings.output.name,
      ]);
    });

    it('prepares object property for name', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.objectProperty.mock.calls[1]
      ).toEqual([
        'nameIdentifier',
        testSpecificMocks.defaultArgs[1]
      ]);
    });

    it('prepares value for arguments identifier', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        privateApi.getArgsForObject.mock.calls
      ).toEqual([
        [
          testSpecificMocks.state,
          testSpecificMocks.otherArgs,
        ],
      ]);
    });

    it('prepares identifier for arguments', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.identifier.mock.calls[2]
      ).toEqual([
        testSpecificMocks.state.babelPluginLoggerSettings.output.args,
      ]);
    });

    it('prepares object property for arguments', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.objectProperty.mock.calls[2]
      ).toEqual([
        'argsIdentifier',
        'argsForObject',
      ]);
    });

    it('prepares object argument for logging (we have function arguments)', () => {
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.objectExpression.mock.calls
      ).toEqual([
        [
          [
            'sourceObjProperty',
            'nameObjProperty',
            'argsObjProperty',
          ],
        ],
      ]);
    });

    it('prepares object argument for logging (we do not have function arguments)', () => {
      privateApi.getArgsForObject.mockReturnValueOnce(undefined);
      privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs);

      expect(
        types.objectExpression.mock.calls
      ).toEqual([
        [
          [
            'sourceObjProperty',
            'nameObjProperty',
          ],
        ],
      ]);
    });

    it('returns array with object argument', () => {
      expect(
        privateApi.getForObject(testSpecificMocks.state, testSpecificMocks.defaultArgs, testSpecificMocks.otherArgs)
      ).toEqual(
        [
          'objectExpression',
        ]
      );
    });

  });

  describe('get', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'getDefault').mockReturnValue(['source-path', 'function-name']);
      jest.spyOn(privateApi, 'getFunction').mockReturnValue(['other']);
      jest.spyOn(privateApi, 'getForObject').mockReturnValue(['getForObject']);
    });
    beforeEach(() => {
      testSpecificMocks.path = {
        node: {},
      };
      testSpecificMocks.state = {
        file: {},
        babelPluginLoggerSettings: {
          output: {
            args: 'argsParam',
            name: 'nameParam',
            type: 'simple',
            source: 'sourceParam',
          },
        },
      };
      testSpecificMocks.knownData = {
        column: 11,
        line: 22,
        name: 'functionName',
        source: 'path/to/file.js',
      };

    });
    afterEach(() => {
      privateApi.getDefault.mockClear();
      privateApi.getFunction.mockClear();
      privateApi.getForObject.mockClear();
    });
    afterAll(() => {
      privateApi.getDefault.mockRestore();
      privateApi.getFunction.mockRestore();
      privateApi.getForObject.mockRestore();
    });

    it('prepares default arguments for logger member expression (source file data and method name)', () => {
      loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(privateApi.getDefault).toHaveBeenCalledWith(
        testSpecificMocks.knownData
      );
    });

    it('prepares other arguments for logger member expression by calling `privateApi.getFunction`', () => {
      loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(privateApi.getFunction).toHaveBeenCalledWith(
        testSpecificMocks.path,
        testSpecificMocks.knownData
      );
    });

    it('returns an array with default arguments and other arguments (type = simple)', () => {
      expect(loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData))
        .toEqual(
          [
            'source-path',
            'function-name',
            'other',
          ]
        );
    });

    it('prepares arguments when type is `object`', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.output.type = 'object';
      loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData);

      expect(
        privateApi.getForObject.mock.calls
      )
        .toEqual(
          [
            [
              testSpecificMocks.state,
              privateApi.getDefault(),
              privateApi.getFunction()
            ]
          ]
        );
    });

    it('returns an array with one object that has default arguments and other arguments (type = object)', () => {
      testSpecificMocks.state.babelPluginLoggerSettings.output.type = 'object';
      expect(loggingArguments.get(testSpecificMocks.path, testSpecificMocks.state, testSpecificMocks.knownData))
        .toEqual(
          privateApi.getForObject()
        );
    });

  });

});
