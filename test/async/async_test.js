goog.provide('clulib.asyncTest');
goog.setTestOnly('clulib.asyncTest');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.asserts');
goog.require('goog.testing.TestCase');

goog.require('goog.Promise');

goog.require('clulib.async');

function setUpPage() {
  // 10s
  goog.testing.TestCase.getActiveTestCase().promiseTimeout = 10000;
}

function tearDownPage() {
  // 1s
  goog.testing.TestCase.getActiveTestCase().promiseTimeout = 1000;
}

function testAsyncForEach() {
  var strings = ['first', 'second', 'third'];
  var delays = [500, 200, 50];
  var result = '';

  return clulib.async.forEach(strings, function (element, index, array) {
    assertEquals(strings, array);
    assertEquals(element, array[index]);

    return new goog.Promise(function (resolve) {
      setTimeout(function () {
        result += element;
        resolve();
      }, delays[index]);
    });
  }).then(function () {
    assertEquals(strings.join(''), result);
  });
}