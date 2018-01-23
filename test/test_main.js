goog.module('test.main');

const arrayMain = goog.require('test.clulib.array');
const asyncCompleterMain = goog.require('test.clulib.async.Completer');
const cmMain = goog.require('test.clulib.cm');
const collectionsMain = goog.require('test.clulib.collections');
const domMain = goog.require('test.clulib.dom');
const functionsMain = goog.require('test.clulib.functions');
const httpRequestMain = goog.require('test.clulib.net.http_request');
const mathMain = goog.require('test.clulib.math');

arrayMain();
asyncCompleterMain();
cmMain();
collectionsMain();
domMain();
functionsMain();
httpRequestMain();
mathMain();
