# object-properties [![codecov](https://codecov.io/gh/destinationstransfers/object-properties/branch/master/graph/badge.svg)](https://codecov.io/gh/destinationstransfers/object-properties) 
Browser / Node (>=8) lightweight, fast and well tested library to check, get and set object properties via dot notation

## Motivation

There are bunch of libraries like this on NPM, but most of them either offer too much functionality (array support, a lot of methods), not tree-shaking compatible, has a bad name choice for named import (always do like this ``import { get as getDeepProperty } from 'dotty'`` is a pain and error-prone) or little outdated. So, we've created our own to use on our production apps.

## Requirements

Library is designed to be browser / tree-shaking compatible, but uses modern ES7 features
(`Array.isArray`, `Object.entries`, default arguments and array destruction assignment), so, must be polyfilled/transpilled
for browser use if target browsers are below that level of language support.

## Usage

```js

import { hasDeepProperty, getDeepProperty, setDeepProperty } from '@destinationstransfers/object-properties';

const obj = {};

setDeepProperty(obj, 'a.b.c.d', 'test1');
// obj is now { a: { b: { c: { d: 'test1' }} } }

// also supports Mongoose-like set
setDeepProperty(obj, { e: 1, 'a.b.f': 2 });
// obj is now { a: { b: { c: { d: 'test1' }, f: 2 } }, e: 1 }

hasDeepProperty(obj, 'a.b.c'); // => true
hasDeepProperty(obj, 'a.d'); // => false

getDeepProperty(obj, 'a.b.f'); // => 2
getDeepProperty(obj, 'a.b.f.g'); // => undefined
```

## License

MIT