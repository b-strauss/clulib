'use strict';

const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;

gulp.task('generate-test-deps', function (callback) {
  return deps(callback);
});

/**
 * @param {Function} callback
 */
function deps(callback) {
  const roots = {
    './lib': '../../../../lib',
    './test': '../../../../test'
  };

  depsHelper(callback, roots);
}

/**
 * @param {Function} callback
 * @param {Object<string, string>} roots
 */
function depsHelper(callback, roots) {
  const depswriter = path.normalize('./node_modules/google-closure-library/closure/bin/build/depswriter.py');

  let command = `python ${depswriter}`;

  for (let key in roots) {
    if (roots.hasOwnProperty(key))
      command += ` --root_with_prefix="${path.normalize(key)} ${path.normalize(roots[key])}"`;
  }

  command += ` > ${path.normalize('./test/deps.js')}`;

  exec(command, function (err) {
    callback(err);
  });
}