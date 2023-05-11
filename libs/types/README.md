# Semantic Types

## Conventions

### Type Interface

```
name: "type name",
alias: ["type alias"],
defaultValue: null,

sanitize: (value, meta, i18n, path) => sanitized,
serialize: (value, meta) => string
```

### Common Type Meta

* {boolean} rawValue - Keep raw value, do not transform
* 

### Validation Error

* message
* status = 400
* code = E_INVALID_DATA
* info = { value, meta, [i18n], [path] }

### Plugins

* datetimeParser
* bigintWriter