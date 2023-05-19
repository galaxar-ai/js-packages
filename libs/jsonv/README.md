# @galaxar/jsonv

JSON Validation Syntax

## Installation

```sh
pnpm install @galaxar/jsonv
```

## Usage that requires special attention

-   `Jvs.match(value, null)` always return true

    It does not mean to match null, which should use `{ $exist: false }` instead.

-   `Jvs.match(value, [ ... ])` means to match all jvs object in the array

    It does not mean the value to be equal to the array, which should use `{ $eq: [ ... ] }` instead.
