goog.module('test.clulib.collections');

const {objectToMap, mapToObject} = goog.require('clulib.collections');

exports = function () {
  describe('clulib.collections', () => {
    const object = {
      'a': 1,
      'b': 2,
      'c': 3
    };

    const map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);

    describe('objectToMap', () => {
      it('should convert an object to a Map', () => {
        const m = objectToMap(object);

        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(2);
        expect(m.get('c')).toBe(3);
      });
    });

    describe('mapToObject', () => {
      it('should convert a Map to an object', () => {
        const o = mapToObject(map);

        expect(o['a']).toBe(1);
        expect(o['b']).toBe(2);
        expect(o['c']).toBe(3);
      });
    });
  });
};
