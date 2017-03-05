goog.provide('clulib.arrayTest');
goog.setTestOnly('clulib.arrayTest');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.asserts');

goog.require('clulib.array');

function testArrayRemoveHoles() {
  var a = [0, 1];
  var b = clulib.array.removeHoles([0,,,1]);

  assertArrayEquals(a, b);
}