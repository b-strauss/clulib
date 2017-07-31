goog.module('test.main');

const arrayMain = goog.require('test.clulib.array');
const asyncCompleterMain = goog.require('test.clulib.async.Completer');
const cmMain = goog.require('test.clulib.cm');
const domMain = goog.require('test.clulib.dom');

arrayMain();
asyncCompleterMain();
cmMain();
domMain();
