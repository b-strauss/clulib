goog.module('test.clulib.l10n.ResourceBundle');

const ResourceBundle = goog.require('clulib.l10n.ResourceBundle');

const env = goog.require('testing.environment');

const base = `${env.basePath}/test-assets/l10n`;

exports = function () {
  describe('clulib.l10n.ResourceBundle', () => {
    it('should load resource files', async () => {
      const bundle = new ResourceBundle('test', 'de-DE', base);

      expect(bundle.id).toBe('test');
      expect(bundle.locale).toBe('de-DE');
      expect(bundle.loaded).toBe(false);

      await bundle.load();

      expect(bundle.loaded).toBe(true);
      expect(bundle.contains('string-placeholder')).toBe(true);
      expect(bundle.getArray('array')).toEqual([0, 1, 2]);
      expect(bundle.getBoolean('boolean')).toBe(false);
      expect(bundle.getNumber('number')).toBe(10);
      expect(bundle.getString('string')).toBe('Hallo, Welt!');
      expect(bundle.getObject('object')).toEqual({'eins': 1, 'zwei': 2, 'drei': 3});

      expect(bundle.getString('string-placeholder', {'from': 'Bob', 'to': 'Max'}))
        .toBe('Hallo Max, mein name ist Bob.');
    });
  });
};
