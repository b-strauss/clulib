'use strict';

const exec = require('child_process').exec;
const path = require('path');

const closureCompiler = require('google-closure-compiler').gulp();
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

/**
 * @param {Function} callback
 */
function deps (callback) {
  const roots = {
    './': '../../../..'
  };

  let command = `python ${path.normalize('./node_modules/google-closure-library/closure/bin/build/depswriter.py')}`;

  for (let key in roots) {
    if (roots.hasOwnProperty(key))
      command += ` --root_with_prefix="${path.normalize(key)} ${path.normalize(roots[key])}"`;
  }

  command += ` > ${path.normalize('./tools/jasmine_runner/dev_deps.js')}`;

  exec(command, function (err) {
    callback(err);
  });
}

/**
 * @returns {*}
 */
function compile () {
  const inputs = [
    'node_modules/google-closure-library/closure/goog/**.js',
    '!node_modules/google-closure-library/closure/goog/**_test.js',
    'src/**.js',
    'test/**.js',
    'test_main.js'
  ];

  const externs = [
    'node_modules/google-closure-compiler/contrib/externs/jasmine-2.0.js'
  ];

  const destinationFolder = './bin';

  const debug = false;

  const options = {
    js: inputs.map(input => path.normalize(input)),
    externs: externs.map(extern => path.normalize(extern)),
    entry_point: 'test_main',
    language_in: 'ECMASCRIPT_2015',
    language_out: 'ECMASCRIPT5_STRICT',
    compilation_level: 'ADVANCED',
    warning_level: 'VERBOSE',
    define: [
      debug ? 'goog.DEBUG=true' : 'goog.DEBUG=false'
    ],
    assume_function_wrapper: 'true',
    rewrite_polyfills: 'true',
    // https://github.com/google/closure-compiler/wiki/Warnings
    jscomp_error: [
      'accessControls',
      'const',
      'missingProvide',
      'missingRequire',
      'missingReturn',
      'useOfGoogBase'
    ],
    jscomp_warning: [
      'checkDebuggerStatement',
      'checkRegExp',
      'deprecatedAnnotations',
      'deprecated',
      'extraRequire',
      'inferredConstCheck'
    ],
    output_wrapper: '(function(){%output%}).call(this);',
    js_output_file: 'test.js'
  };

  return closureCompiler(options)
    .src()
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.', {}))
    .pipe(gulp.dest(path.normalize(destinationFolder)));
}

gulp.task('create-dev-deps', callback => {
  deps(callback);
});
gulp.task('compile', () => compile());
