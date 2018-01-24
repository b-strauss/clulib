goog.module('test.clulib.l10n.ResourceManager');

const ResourceManager = goog.require('clulib.l10n.ResourceManager');
const env = goog.require('testing.environment');

const base = `${env.basePath}/test-assets/l10n`;

exports = function () {
  describe('clulib.l10n.ResourceManager', () => {
    it('should load resource files in different languages', async () => {
      const manager = new ResourceManager(['test'], ['de-DE', 'en-GB'], base);

      expect(manager.currentLocale).toBe(null);

      await manager.changeLocale('de-DE');

      expect(manager.contains('test', 'string-placeholder')).toBe(true);

      expect(manager.getArray('test', 'array')).toEqual([0, 1, 2]);
      expect(manager.getBoolean('test', 'boolean')).toBe(false);
      expect(manager.getNumber('test', 'number')).toBe(10);
      expect(manager.getString('test', 'string')).toBe('Hallo, Welt!');
      expect(manager.getObject('test', 'object')).toEqual({'eins': 1, 'zwei': 2, 'drei': 3});

      expect(manager.getString('test', 'string-placeholder', {'from': 'Bob', 'to': 'Max'}))
        .toBe('Hallo Max, mein name ist Bob.');

      await manager.changeLocale('en-GB');

      expect(manager.contains('test', 'string-placeholder')).toBe(true);

      expect(manager.getArray('test', 'array')).toEqual([0, 1, 2]);
      expect(manager.getBoolean('test', 'boolean')).toBe(false);
      expect(manager.getNumber('test', 'number')).toBe(10);
      expect(manager.getString('test', 'string')).toBe('Hello, world!');
      expect(manager.getObject('test', 'object')).toEqual({'one': 1, 'two': 2, 'three': 3});

      expect(manager.getString('test', 'string-placeholder', {'from': 'Bob', 'to': 'Max'}))
        .toBe('Hello Max, my name is Bob.');
    });
  });
};
