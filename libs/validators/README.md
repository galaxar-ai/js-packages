# @galaxar/validators

Galaxar object modifiers syntax (OMS)

## Modifier syntax

-   A standalone modifier (i.e. no argument) can be a string with modifier prefix and the name of modifier.
-   For modifiers with argument (or payload), they can be expresses in the form of an object or an array.
    -   object style
        -   "name" field, is the modifier name, e.g. ~mobile
        -   "options" field is the options argument, e.g. { locale: 'en-US' }
    -   array style
        -   [0] is the modifier,
        -   [1] is the options argument

## Types of modifiers

\_ validator - starting with `~`

-   processor

    -   starting with `|`

-   activator
    -   starting with `=`

## Modifier handlers

Different type of modifier will use different handlers map and the signture of the handler function is also a bit different.

-   validator handler: `(value, options, meta, context) => [ true or false, null or failed reason ]`

    -   A validator returns false will stop the modifier pipeline and throw a ValidationError

-   processor handler: `(value, options, meta, context) => value`

-   activator handler: `(options, meta, context) => value`,
    -   An activator will not be called unless the value is null.

## Sample syntax

```js
import validator from '@galaxar/validator';

validator.sanitize(obj, {
    type: 'object',
    schema: {
        // key1 field's value should be an integer within the range from 10 to 30
        key1: { type: 'integer', mod: [
                    ['~max', 30],
                    ['~min', 10],
                ]  },
        // key2 field's value should be an integer within the range from 20 to 30
        key2: { type: 'integer', mod: [
                    ['~max', 20],
                    ['~min', 10],
                ]  },
    },
    optional: true,
    mod: [
        {
            // the object as a whole should match the jsonv expression below, ~jsv === ~jsonv
            name: '~jsv',
            options: {
                key1: {
                    $gt: '$$.key2' // or $$ROOT.key2
                }
            }
        },
        [
            // after passing the validation above, the object will be transformed by the below jsonx expression, |jsx === |jsonx
            '|jsx', {
                // transform from object to an array
                $toArray: { name: '$$KEY', value: '$$CURRENT' }
            }
        ],
        // finally, there is auto activator to ensure the object has an auto value if it is null
        '=default'
    ]
});

// { key1: 20, key2: 15 } => [ { name: 'key1', value: 20 }, { name: 'key2', value: 15 } ]
```

## Usage

Sync mode

```js
import validator, { Types } from '@galaxar/validator';
validator.addValidator('isEmail', () => [ true or false, reason if false ]);
validator.addProcessor('escape', () => {});
validator.addActivator('randomFill', () => {});
validator.sanitize()
```

Async mode

```js
import validator, { Types } from '@galaxar/validator/async';
validator.addValidator('isEmail', () => [ true or false, reason if false ]);
validator.addProcessor('escape', () => {});
validator.addActivator('randomFill', () => {});
await validator.sanitize_()
```

Sync mode with all modifiers

```js
import validator, { Types } from '@galaxar/validator/allSync';
validator.sanitize()
```

Async mode with all modifiers

```js
import validator, { Types } from '@galaxar/validator/allAsync';
await validator.sanitize_()
```
