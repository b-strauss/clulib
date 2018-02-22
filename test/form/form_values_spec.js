goog.module('test.clulib.form.FormValues');

const FormValues = goog.require('clulib.form.FormValues');

exports = function () {
  describe('clulib.form.FormValues', () => {
    it('should append and get a single value per name', () => {
      const values = new FormValues();

      expect(values.has('firstname')).toBe(false);

      values.append('firstname', 'Max');
      values.append('lastname', 'Mustermann');

      expect(values.has('firstname')).toBe(true);

      expect(values.get('firstname')).toBe('Max');
      expect(values.get('lastname')).toBe('Mustermann');
    });

    it('should append and get multiple values per name', () => {
      const values = new FormValues();

      expect(values.has('cities')).toBe(false);

      values.append('cities', 'Berlin');
      values.append('cities', 'Munich');

      expect(values.has('cities')).toBe(true);

      expect(values.get('cities')).toBe('Berlin');
      expect(values.getAll('cities')).toEqual(['Berlin', 'Munich']);
    });

    it('should delete values', () => {
      const values = new FormValues();

      expect(values.has('firstname')).toBe(false);

      values.append('firstname', 'Max');

      expect(values.has('firstname')).toBe(true);
      expect(values.get('firstname')).toBe('Max');

      values.delete('firstname');

      expect(values.has('firstname')).toBe(false);
    });

    it('should set values', () => {
      const values = new FormValues();

      expect(values.has('firstname')).toBe(false);

      values.append('firstname', 'Max');

      expect(values.has('firstname')).toBe(true);
      expect(values.get('firstname')).toBe('Max');

      values.set('firstname', 'Bob');

      expect(values.get('firstname')).toBe('Bob');
    });

    it('should be able to be cloned', () => {
      const values = new FormValues();
      values.set('firstname', 'Max');

      const copy = values.clone();

      values.delete('firstname');

      expect(copy.get('firstname')).toBe('Max');
    });

    it('should be able to be converted to a Map', () => {
      const values = new FormValues();
      values.set('firstname', 'Max');

      const map = values.toMap();

      values.delete('firstname');

      expect(map.get('firstname')).toBe('Max');
    });

    it('should be able to create a FormData object', () => {
      const values = new FormValues();
      values.set('firstname', 'Max');

      const formData = values.toFormData();

      expect(formData).toEqual(jasmine.any(FormData));
    });

    it('should be able to be created from a Map', () => {
      const map = new Map();
      map.set('firstname', 'Max');

      const values = new FormValues(map);

      map.clear();

      expect(values.get('firstname')).toBe('Max');
    });
  });
};
