'use strict';

const {exec} = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const closureCompiler = require('google-closure-compiler').gulp();
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const {env} = require('gulp-util');

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

  command += ` > ${path.normalize('./tools/jasmine_runner/deps.js')}`;

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

  const isDebug = env.debug != null && env.debug === 'true';

  const options = {
    js: inputs.map(input => path.normalize(input)),
    externs: externs.map(extern => path.normalize(extern)),
    entry_point: 'test.main',
    language_in: 'ECMASCRIPT_2017',
    language_out: 'ECMASCRIPT5_STRICT',
    compilation_level: isDebug ? 'SIMPLE' : 'ADVANCED',
    warning_level: 'VERBOSE',
    define: [
      `goog.DEBUG=${isDebug ? 'true' : 'false'}`
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
      'extraRequire'
    ],
    output_wrapper: '(function(){%output%}).call(this);',
    js_output_file: 'test.min.js'
  };

  return closureCompiler(options)
    .src()
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.', {}))
    .pipe(gulp.dest(path.normalize(destinationFolder)));
}

function createPackage () {
  const files = [
    ['./', 'AUTHORS'],
    ['./', 'CHANGELOG.md'],
    ['./', 'LICENSE'],
    ['./', 'README.md']
  ];

  const folders = [
    ['./', 'src']
  ];

  const target = './dist/';

  fs.emptyDirSync(target);

  files.concat(folders).forEach(element => {
    const path = element[0];
    const name = element[1];
    fs.copySync(path + name, target + name);
  });

  const packageJson = fs.readJsonSync('./package.json');

  delete packageJson['private'];
  delete packageJson['scripts'];
  delete packageJson['pre-commit'];
  delete packageJson['devDependencies'];

  fs.writeJsonSync(`${target}/package.json`, packageJson, {spaces: 2});
}

gulp.task('create-package', () => createPackage());
gulp.task('compile', () => compile());
gulp.task('deps', callback => {
  deps(callback);
});
