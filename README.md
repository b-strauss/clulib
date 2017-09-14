# clulib - closure-library utilities

[![Build status](https://img.shields.io/travis/b-strauss/clulib/master.svg)](https://travis-ci.org/b-strauss/clulib)
[![npm version](https://img.shields.io/npm/v/clulib.svg)](https://www.npmjs.com/package/clulib)
[![MIT license](https://img.shields.io/badge/license-MIT_License-yellow.svg)](https://spdx.org/licenses/MIT.html)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/b-strauss.svg)](https://saucelabs.com/u/b-strauss)

Clulib is a JavaScript library that aims to complement google's [closure-library](https://github.com/google/closure-library/).
Some parts build ontop of existing closure classes (e.g. the ComponentManager), while other parts provide useful functionality not
present inside the closure-library.

## Usage

To use clulib, install the `closure-library` and `closure-compiler` packages.
Recommended versions for both are `20170626.0.0` or higher.

Example `package.json`:
```JavaScript
"google-closure-compiler": "20170626.0.0",
"google-closure-library": "20170626.0.0",
```

To include clulib, include all files under `./src` into your build process. All modules are prefixed with `clulib`
(e.g. `clulib.array`).

Clulib is written with closure's new `goog.module` system. See [goog.module: an ES6 module like alternative to goog.provide](https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide)
on the closure-compiler wiki page, for infos on how to use it.

Clulib heavily uses newer ECMAScript features. The closure-compiler can compile these down to ES5. The required input language
compiler option for clulib is `ECMASCRIPT_2017`. Because of this, uncompiled code can only run on current Browsers (Chrome is recommended).

Clulib is compatible with closures `ADVANCED_OPTIMIZATIONS` mode.

This project follows [Semantic Versioning](http://semver.org/) as closely as possible.

## Running the test specs

Checkout `https://github.com/b-strauss/clulib.git`

Required tools:

- Python
- Java
- Yarn
- Chrome Browser

Run `yarn install` to install all npm packages.

To generate the closure deps for local testing run: `yarn deps`. The html file under `tools/jasmine_runner/spec_runner_dev.html` can
then run the uncompiled test code. Because of the newer ECMAScript features, this requires a current version of the Chrome Browser.

To generate the compiled and minified version for local testing run: `yarn compile`. The html file under
`tools/jasmine_runner/spec_runner_prod.html` can then run the compiled test code on all supported Browsers.
You can also run `yarn compile-debug` to compile with assertions enabled for testing, this enables additional runtime checks but
significantly increases the output size.

The command `yarn test` starts a local karma test runner on Chrome and runs all test specs that have been compiled with
`yarn compile`.
