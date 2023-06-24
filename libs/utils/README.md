# @galaxar/utils

## test register for adding missing should assertion helpers into chai

Add below lines in `.mocharc.js` after `@babel/register` or `@swc-node/register`

E.g.
```
require('@swc-node/register');
require('@galaxar/utils/testRegister');
```

### some difference between should and chai

```
// left: should, right: chai
should.be.true() => should.be.true
should.be.false() => should.be.false
should.be.ok() => should.be.ok
```
