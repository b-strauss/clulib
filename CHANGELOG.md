<a name="3.3.0"></a>
## [3.3.0](https://github.com/b-strauss/clulib/compare/3.2.0...3.3.0) (2018-01-16)

### Features

* feat(net): httpRequest, httpGetText, httpGetJson ([237a15b](https://github.com/b-strauss/clulib/commit/237a15b))


<a name="3.2.0"></a>
## [3.2.0](https://github.com/b-strauss/clulib/compare/3.1.0...3.2.0) (2018-01-12)

### Features

* feature(functions): cacheAsyncValue ([b924995](https://github.com/b-strauss/clulib/commit/b924995))


<a name="3.1.0"></a>
## [3.1.0](https://github.com/b-strauss/clulib/compare/3.0.0...3.1.0) (2017-09-14)

### Features

* feature(cm): metadata getter for component metadata

  Component metadata like `type` and `selector` can now be defined inside a static getter on the component.
  This feature needs to be used in combination with the `addClass` and `addClasses` methods on the `ComponentManager`.
  
  Example:
  
  ```Javascript
  // inside 'ButtonComponent'
  static get metadata () {
    return {
      type: 'default-button',
      selector: 'button.default-button'
    };
  }
  
  // adding the component
  cm.addclass(ButtonComponent);
  ```


<a name="3.0.0"></a>
# [3.0.0](https://github.com/b-strauss/clulib/compare/2.0.0...3.0.0) (2017-08-27)

### BREAKING CHANGES

* feature(general): use goog.module for the whole codebase

  The whole library now uses `goog.module` instead of `goog.provide`. This makes the code more concise, easier to understand, and resembles ES2015 modules more closely.
  Most old `goog.require` namespaces have identical `goog.module` ids. Only the component manager code has been refactored into `clulib.cm`.
  See the [closure wiki](https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide) for more infos on how to use `goog.module`.
  `goog.module` code can still be used inside legacy `goog.provide` code.

* feature(general): use ES2015 classes for the whole codebase

  All classes are now real ES2015 classes. The closure-compiler understands these, and can mix them with legacy `goog.inherits` classes.
  Please note that the classes do not yet use getters/setters, as the closure-compiler currently doesn't understand `@template` types on getters/setters.

<a name="2.0.0"></a>
# [2.0.0](https://github.com/b-strauss/clulib/compare/1.3.0...2.0.0) (2017-07-30)

### BREAKING CHANGES

* update(project): rename lib into src ([7c7e14a](https://github.com/b-strauss/clulib/commit/7c7e14a))

  All source files now reside under `./src`. Update your build script accordingly.

* remove: `clulib.async.forEach` and `clulib.async.forEachRight` ([94d45f3](https://github.com/b-strauss/clulib/commit/94d45f3))

  Use `clulib.array.asyncForEach` and `clulib.array.asyncForEachRight` instead.

* remove: `clulib.sdks.loadFacebookSdk` and `clulib.sdks.loadGooglePlusSdk` ([3d21e3f](https://github.com/b-strauss/clulib/commit/3d21e3f))

  There is no replacement for these functions.

* update: `clulib.cm.ComponentManager` to use `Map` instead ot the deprecated `goog.structs.Map` ([84c75b7](https://github.com/b-strauss/clulib/commit/84c75b7))

  * `clulib.cm.ComponentManager.prototype.getRegistry` now returns a `Map`
  * `clulib.cm.ComponentManager.prototype.addComponentMap` now accepts only an object of type `!Object<string, function(new:clulib.cm.Component)>`

### Bug Fixes

* fix(cm): node_tree superfluous require ([75af17a](https://github.com/b-strauss/clulib/commit/75af17a))


<a name="1.3.1"></a>
## [1.3.1](https://github.com/b-strauss/clulib/compare/1.3.0...1.3.1) (2017-07-25)

### Bug Fixes

* fix(cm): node_tree superfluous require ([75af17a](https://github.com/b-strauss/clulib/commit/75af17a))


<a name="1.3.0"></a>
# [1.3.0](https://github.com/b-strauss/clulib/compare/1.2.0...1.3.0) (2017-07-14)

### Bug Fixes

* fix: use strict equality check for all checks not comparing null ([0ba012a](https://github.com/b-strauss/clulib/commit/0ba012a))
* fix(async): `forEachRight` to not change the original array ([fc56665](https://github.com/b-strauss/clulib/commit/fc56665))

### Deprecations

* deprecate: `clulib.async.forEach` and `clulib.async.forEachRight` in favor of `clulib.array.asyncForEach` and `clulib.array.asyncForEachRight` ([8fc8ecc](https://github.com/b-strauss/clulib/commit/8fc8ecc))
* deprecate: `clulib.sdks.loadFacebookSdk` and `clulib.sdks.loadGooglePlusSdk` ([d12c232](https://github.com/b-strauss/clulib/commit/d12c232))


<a name="1.2.0"></a>
# [1.2.0](https://github.com/b-strauss/clulib/compare/1.1.2...1.2.0) (2017-02-26)

### Features

* feat(array): add `clulib.array.removeHoles` ([61a698a](https://github.com/b-strauss/clulib/commit/61a698a))
* feat(async): `clulib.async.forEach` + `clulib.async.forEachRight` ([a9fc7df](https://github.com/b-strauss/clulib/commit/a9fc7df))
* feat(dom): `clulib.dom.matches` + `clulib.dom.closest` ([f674dba](https://github.com/b-strauss/clulib/commit/f674dba))

### Bug Fixes

* fix(ui): ToggleButton setChecked not being callable if disabled ([1fd15cf](https://github.com/b-strauss/clulib/commit/1fd15cf))

### Misc

* docs(cm): clarify forbidden method calls on Component ([a617175](https://github.com/b-strauss/clulib/commit/a617175))


<a name="1.1.2"></a>
## [1.1.2](https://github.com/b-strauss/clulib/compare/1.1.1...1.1.2) (2017-02-10)

### Bug Fixes

* fix(cm): call addChild before decorate to prevent `goog.ui.Component`'s repositioning ([97d49e9](https://github.com/b-strauss/clulib/commit/97d49e9))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/b-strauss/clulib/compare/1.1.0...1.1.1) (2017-02-09)

### Bug Fixes

* fix(cm): make private apis package private ([9232679](https://github.com/b-strauss/clulib/commit/9232679))
* fix `Element.prototype.closest` fallback calling `hasAttribute` on non Elements ([0f04bca](https://github.com/b-strauss/clulib/commit/0f04bca))

### Misc

* perf(cm): compiler optimizations ([e4ec400](https://github.com/b-strauss/clulib/commit/e4ec400))
* perf: more const usages ([aafd248](https://github.com/b-strauss/clulib/commit/aafd248))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/b-strauss/clulib/compare/1.0.2...1.1.0) (2017-02-02)

### Features

* feature: add queryComponent/queryComponentAll on ComponentManager ([debdcca](https://github.com/b-strauss/clulib/commit/debdcca))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/b-strauss/clulib/compare/1.0.1...1.0.2) (2017-01-25)

### Bug Fixes

* fix: more compiler warnings ([2baa8ec](https://github.com/b-strauss/clulib/commit/2baa8ec))
* fix: compiler warning ([ac58ea4](https://github.com/b-strauss/clulib/commit/ac58ea4))

### Misc

* refactor: rename completers ([d954782](https://github.com/b-strauss/clulib/commit/d954782))
* add changelog ([abd1b5c](https://github.com/b-strauss/clulib/commit/abd1b5c))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/b-strauss/clulib/compare/1.0.0...1.0.1) (2017-01-22)

### Bug Fixes

* use es2015 default params ([128e9a9](https://github.com/b-strauss/clulib/commit/128e9a9))



<a name="1.0.0"></a>
# 1.0.0 (2017-01-14)

* initial release


