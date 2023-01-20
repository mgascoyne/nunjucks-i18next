import { I18nextExtension } from './i18next.extension';

/**
 * Tests for Nunjucks Translation Extension.
 */
describe('I18nextExtension', () => {
  let extension: I18nextExtension = null;

  beforeEach(() => {
    extension = new I18nextExtension({
      i18nextTranslations: {
        resources: {
          de: {
            translation: {
              'message.hello': 'Hallo',
              'message.hello_with_params': 'Hallo {{name}}',
            },
          },
          en: {
            translation: {
              'message.hello': 'Hello',
              'message.hello_with_params': 'Hello {{name}}',
            },
          },
        },
      },
      defaultLocale: 'en',
    });
  });

  it('supports suggested tags', () => {
    expect(extension.tags).toContain('trans');
  });

  it('parses correctly', () => {
    const nextTokenMock = jest.fn(() => {
      return { value: 'token_value' };
    });
    const parseSignatureMock = jest.fn(() => ['arg1', 'arg2']);
    const advanceAfterBlockEndMock = jest.fn();
    const parseUntilBlocksMock = jest.fn(() => 'hello');
    const parserMock = class {
      nextToken = nextTokenMock;
      parseSignature = parseSignatureMock;
      advanceAfterBlockEnd = advanceAfterBlockEndMock;
      parseUntilBlocks = parseUntilBlocksMock;
    };

    const callExtensionMock = class {};

    const nodesMock = class {
      CallExtension = callExtensionMock;
    };

    const lexerMock = jest.fn();

    expect(
      extension.parse(new parserMock(), new nodesMock(), lexerMock),
    ).toBeInstanceOf(callExtensionMock);

    expect(nextTokenMock).toHaveBeenCalled();
    expect(parseSignatureMock).toHaveBeenCalledWith(null, false);
    expect(parseUntilBlocksMock).toHaveBeenCalledWith('endtrans');
    expect(advanceAfterBlockEndMock).toHaveBeenCalledWith('token_value');
  });

  it('translates correctly for de locale', () => {
    expect(extension.trans({}, 'de', () => 'message.hello')).toEqual({
      length: 5,
      val: 'Hallo',
    });
  });

  it('translates correctly for en locale', () => {
    expect(extension.trans({}, 'en', () => 'message.hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with fallback to default en locale', () => {
    expect(extension.trans({}, undefined, () => 'message.hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with fallback to default en locale', () => {
    expect(extension.trans({}, 'fr', () => 'message.hello')).toEqual({
      length: 5,
      val: 'Hello',
    });
  });

  it('translates correctly with parameters for de locale', () => {
    expect(
      extension.trans(
        {},
        'de',
        { name: 'Welt' },
        () => 'message.hello_with_params',
      ),
    ).toEqual({
      length: 10,
      val: 'Hallo Welt',
    });
  });

  it('translates correctly with parameters for en locale', () => {
    expect(
      extension.trans(
        {},
        'en',
        { name: 'World' },
        () => 'message.hello_with_params',
      ),
    ).toEqual({
      length: 11,
      val: 'Hello World',
    });
  });

  it('returns translation key on missing translation entry', () => {
    expect(extension.trans({}, 'de', () => 'unknown')).toEqual({
      length: 7,
      val: 'unknown',
    });
  });
});
