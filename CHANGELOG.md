<a name="1.3.0"></a>
# [1.3.0](https://github.com/b-strauss/clulib/compare/1.2.0...1.3.0) (2017-07-14)

### Bug Fixes

* fix: use strict equality check for all checks not comparing null ([0ba012a](https://github.com/b-strauss/clulib/commit/0ba012a))
* fix(async): forEachRight to not change the original array ([fc56665](https://github.com/b-strauss/clulib/commit/fc56665))

### Deprecations

* deprecate: clulib.async.forEach and clulib.async.forEachRight in favor of clulib.array.asyncForEach and clulib.array.asyncForEachRight ([8fc8ecc](https://github.com/b-strauss/clulib/commit/8fc8ecc))
* deprecate: clulib.sdks.loadFacebookSdk and clulib.sdks.loadGooglePlusSdk ([d12c232](https://github.com/b-strauss/clulib/commit/d12c232))


<a name="1.2.0"></a>
# [1.2.0](https://github.com/b-strauss/clulib/compare/1.1.2...1.2.0) (2017-02-26)

### Features

* feat(array): add clulib.array.removeHoles ([61a698a](https://github.com/b-strauss/clulib/commit/61a698a))
* feat(async): clulib.async.forEach + clulib.async.forEachRight ([a9fc7df](https://github.com/b-strauss/clulib/commit/a9fc7df))
* feat(dom): clulib.dom.matches + clulib.dom.closest ([f674dba](https://github.com/b-strauss/clulib/commit/f674dba))

### Bug Fixes

* fix(ui): ToggleButton setChecked not being callable if disabled ([1fd15cf](https://github.com/b-strauss/clulib/commit/1fd15cf))

### Misc

* docs(cm): clarify forbidden method calls on Component ([a617175](https://github.com/b-strauss/clulib/commit/a617175))


<a name="1.1.2"></a>
## [1.1.2](https://github.com/b-strauss/clulib/compare/1.1.1...1.1.2) (2017-02-10)

### Bug Fixes

* fix(cm): call addChild before decorate to prevent goog.ui.Component's repositioning ([97d49e9](https://github.com/b-strauss/clulib/commit/97d49e9))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/b-strauss/clulib/compare/1.1.0...1.1.1) (2017-02-09)

### Bug Fixes

* fix(cm): make private apis package private ([9232679](https://github.com/b-strauss/clulib/commit/9232679))
* fix Element.prototype.closest fallback calling hasAttribute on non Elements ([0f04bca](https://github.com/b-strauss/clulib/commit/0f04bca))

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


