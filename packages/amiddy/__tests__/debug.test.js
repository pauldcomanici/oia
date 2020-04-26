
// testing file
import debug, {privateApi} from '../src/debug';


describe('debug', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.isActive', () => {
    it('by default has value as false', () => {
      expect(privateApi.isActive).toBe(false);
    });
  });

  describe('activate', () => {
    afterEach(() => {
      // clear value for isActive
      privateApi.isActive = false;
    });

    it('updates isActive state, now will have value as true', () => {
      debug.activate();

      expect(privateApi.isActive).toBe(true);
    });
  });

  describe('log', () => {
    beforeAll(() => {
      jest.spyOn(console, 'debug').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.msg = 'debug message';
    });

    afterEach(() => {
      // clear value for isActive
      privateApi.isActive = false;

      console.debug.mockClear(); // eslint-disable-line no-console
    });
    afterAll(() => {
      console.debug.mockRestore(); // eslint-disable-line no-console
    });

    it('nothing happens if debug mode is not active', () => {
      debug.log(testSpecificMocks.msg);

      expect(
        console.debug // eslint-disable-line no-console
      ).not.toHaveBeenCalled();
    });

    it('log message provided when debug mode is active', () => {
      privateApi.isActive = true;
      debug.log(testSpecificMocks.msg);

      expect(
        console.debug // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        testSpecificMocks.msg
      );
    });
  });

  describe('block', () => {
    beforeAll(() => {
      jest.spyOn(console, 'debug').mockReturnValue(undefined);
    });
    beforeEach(() => {
      testSpecificMocks.msgs = [
        'first message',
        '2nd message',
        '3rd message',
      ];
    });

    afterEach(() => {
      // clear value for isActive
      privateApi.isActive = false;

      console.debug.mockClear(); // eslint-disable-line no-console
    });
    afterAll(() => {
      console.debug.mockRestore(); // eslint-disable-line no-console
    });

    it('nothing happens if debug mode is not active', () => {
      debug.block(testSpecificMocks.msgs);

      expect(
        console.debug // eslint-disable-line no-console
      ).not.toHaveBeenCalled();
    });

    it('log message provided when debug mode is active', () => {
      privateApi.isActive = true;
      debug.block(testSpecificMocks.msgs);

      expect(
        console.debug // eslint-disable-line no-console
      ).toHaveBeenCalledWith(
        testSpecificMocks.msgs
      );
    });
  });


});
