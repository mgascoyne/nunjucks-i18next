# Nunjucks i18next

[![Build][github-actions-image]][github-actions-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Nunjucks extension for translation with i18next. With this
extension you can use the `trans` and `endtrans` tags or the `trans` filter. 

### How to install it?

```
$ npm install nunjucks-i18next
```

### How to use it?

Example using static translations

```js
import { I18nextTranslationExtension } from 'nunjucks-i18next';

const i18nextExtension = new I18nextExtension({
  i18nextTranslations: {
    resources: {
      de: {
        translation: {
          hello1: 'Hallo',
          hello2: 'Hallo {{name}}',
        },
      },
      en: {
        translation: {
          hello1: 'Hello',
          hello2: 'Hello {{name}}',
        },
      }, 
    },
  },
  defaultLocale: en,
});

nunjucksEnv.addExtension('i18next-extension', i18nextExtension);
nunjucksEnv.addFilter('trans', (textId: string, locale: string, params: object) =>
  i18nextExtension.translateText(textId, locale, params),
);
```
Example using translations from JSON file:

```js
import * as fs from 'fs';
import { I18nextExtension } from 'nunjucks-i18next';

const i18nextExtension = new I18nextExtension(
  JSON.parse(
    fs.readFileSync('/path/to/translation.json', 'utf8'),
  )  
);

nunjucksEnv.addExtension('i18next-extension', i18nextExtension);
nunjucksEnv.addFilter('trans', (textId: string, locale: string, params: object) =>
  i18nextExtension.translateText(textId, locale, params),
);
```

#### Translate content using tags

You can use the `trans` and `endtrans` tags to translate your content.

```html
<html>
  <head>
  </head>
  <body>
    {% trans('de') %}message.hello1{% endtrans %} // result will be "Hallo"
    {% trans('en') %}message.hello1{% endtrans %} // result will be "Hello"
    {% trans('de', { name: 'John Doe' }) %}message.hello2{% endtrans %} // result will be "Hallo John Doe"
    {% trans('de', { name: 'John Doe' }) %}message.hello2{% endtrans %} // result will be "Hello John Doe"
  </body>
</html>
```

#### Translate content using filter

You can also use the `trans` filter to translate your content.

```html
<html>
  <head>
  </head>
  <body>
    {{ 'message.hello1'|trans('de') }} // result will be "Hallo"
    {{ 'message.hello1'|trans('en') }} // result will be "Hello"
    {{ 'message.hello2'|trans('de', { name: 'John Doe' }) }} // result will be "Hallo John Doe"
    {{ 'message.hello2'|trans('en', { name: 'John Doe' }) }} // result will be "Hello John Doe"
  </body>
</html>
```

[npm-image]: https://img.shields.io/npm/v/nunjucks-i18next.svg?label=NPM%20Version
[npm-url]: https://npmjs.org/package/nunjucks-i18next
[downloads-image]: https://img.shields.io/npm/dt/nunjucks-i18next?label=Downloads
[downloads-url]: https://npmjs.org/package/nunjucks-i18next
[github-actions-image]: https://img.shields.io/github/actions/workflow/status/mgascoyne/nunjucks-i18next/tests.yml?branch=master
[github-actions-url]: https://github.com/mgascoyne/nunjucks-i18next/actions
