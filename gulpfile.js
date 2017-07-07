'use strict';

const exec = require('child_process').exec;
const path = require('path');

const closureCompiler = require('google-closure-compiler').gulp();
const gulp = require('gulp');

const testFiles = [
  'node_modules/google-closure-library/closure/goog/**.js',
  '!node_modules/google-closure-library/closure/goog/**_test.js',
  'lib/**.js',
  'test/**.js',
  'test_main.js'
];

const depsRoots = {
  './': '../../../..'
};

/**
 * @param {Function} callback
 * @param {Object<string, string>} roots
 */
function deps(callback, roots) {
  let command = 'python ' + path.normalize('./node_modules/google-closure-library/closure/bin/build/depswriter.py');

  for (let key in roots) {
    if (roots.hasOwnProperty(key))
      command += ' --root_with_prefix="' + path.normalize(key) + ' ' + path.normalize(roots[key]) + '"';
  }

  command += ' > ' + path.normalize('./tools/jasmine_runner/dev_deps.js');

  exec(command, function (err) {
    callback(err);
  });
}

/**
 * @param {Array<string>} inputs
 * @param {string} entryPoint
 * @param {string} outputFile
 * @param {boolean=} opt_debug
 * @returns {*}
 */
function compile(inputs, entryPoint, outputFile, opt_debug) {
  const debug = opt_debug || false;
  const destinationFolder = path.normalize('./bin');
  const externs = [
    'node_modules/google-closure-compiler/contrib/externs/jasmine-2.0.js'
  ];

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

gulp.task('create-dev-deps', callback => {
  deps(callback, depsRoots);
});
gulp.task('compile-test', () => compile(testFiles, 'test_main', 'test.js'));