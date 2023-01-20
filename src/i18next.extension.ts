import * as i18next from 'i18next';
import { Extension, runtime } from 'nunjucks';
import { Context } from 'vm';
import SafeString = runtime.SafeString;

/**
 * Nunjucks extension for content translation with i18next.
 */
export class I18nextExtension implements Extension {
  /**
   * Constructor.
   *
   * @param {object} options Options for the extension
   */
  constructor(
    private readonly options: I18nextExtensionOptions = {
      i18nextTranslations: {},
      defaultLocale: 'en',
    },
  ) {
    i18next.init({
      ...options.i18nextTranslations,
      fallbackLng: [options.defaultLocale],
    });
  }

  /**
   * Tags this extension supports.
   */
  get tags(): string[] {
    return ['trans'];
  }

  /**
   * Parse tag.
   *
   * @param {any} parser Nunjucks parser
   * @param {any} nodes Nunjucks nodes
   * @param {any} lexer Nunjucks lexer
   */
  public parse(parser, nodes, lexer) {
    // get the tag token
    const tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = parser.parseSignature(null, false);
    parser.advanceAfterBlockEnd(tok.value);

    // parse the body
    const body = parser.parseUntilBlocks('endtrans');

    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'trans', args, [body]);
  }

  /**
   * Translate text.
   *
   * @param {Context} context Nunjucks context
   * @param {string} locale Locale
   * @param {Function} body Function providing body
   * @return {string}
   */
  public trans(...args: any): SafeString {
    const context = args.shift();
    const locale = args.shift();
    const body = args.pop();
    const params = args.shift() || {};
    const translationId = typeof body === 'function' ? body() : '';

    return new SafeString(this.translateText(translationId, locale, params));
  }

  /**
   * Translate text.
   *
   * @param {string} textId Text ID to translate
   * @param {string} locale Translation locale
   * @param {object} params Params for translation
   * @return {string}
   * @private
   */
  public translateText(textId: string, locale: string, params: object): string {
    i18next.changeLanguage(locale);

    return i18next.t(textId, params);
  }
}

/**
 * Options for I18nextExtension.
 */
export interface I18nextExtensionOptions {
  i18nextTranslations: object;
  defaultLocale: string;
}
