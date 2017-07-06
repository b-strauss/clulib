'use strict';

const gulp = require('gulp');
const path = require('path');
const closureCompiler = require('google-closure-compiler').gulp();

const testFiles = [
  'node_modules/google-closure-library/closure/goog/**.js',
  '!node_modules/google-closure-library/closure/goog/**_test.js',
  'lib/**.js',
  'test/**.js',
  'test_main.js'
];

const externs = [
  'node_modules/google-closure-compiler/contrib/externs/jasmine-2.0.js'
];

gulp.task('compile-test', () => compile(testFiles, externs, 'test_main', 'test.js'));

/**
 * @param {Array<string>} inputs
 * @param {Array<string>} externs
 * @param {string} entryPoint
 * @param {string} outputFile
 * @param {boolean=} opt_debug
 * @returns {*}
 */
function compile(inputs, externs, entryPoint, outputFile, opt_debug) {
  const debug = opt_debug || false;
  const destinationFolder = path.normalize('./bin');

  const options = {
    js: inputs.map(input => path.normalize(input)),
    externs: externs.map(extern => path.normalize(extern)),
    entry_point: entryPoint,
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
    js_output_file: outputFile
  };

  return closureCompiler(options)
      .src()
      .pipe(gulp.dest(destinationFolder));
}