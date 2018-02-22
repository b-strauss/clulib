goog.module('test.main');

const renderingMain = goog.require('test.clulib.animation.rendering');
const arrayMain = goog.require('test.clulib.array');
const asyncCompleterMain = goog.require('test.clulib.async.Completer');
const cmMain = goog.require('test.clulib.cm');
const collectionsMain = goog.require('test.clulib.collections');
const domMain = goog.require('test.clulib.dom');
const formValuesMain = goog.require('test.clulib.form.FormValues');
const functionsMain = goog.require('test.clulib.functions');
const resourceBundleMain = goog.require('test.clulib.l10n.ResourceBundle');
const resourceManagerMain = goog.require('test.clulib.l10n.ResourceManager');
const httpRequestMain = goog.require('test.clulib.net.http_request');
const mathMain = goog.require('test.clulib.math');
const validationMain = goog.require('test.clulib.validation');

renderingMain();
arrayMain();
asyncCompleterMain();
cmMain();
collectionsMain();
domMain();
formValuesMain();
functionsMain();
resourceBundleMain();
resourceManagerMain();
httpRequestMain();
mathMain();
validationMain();
