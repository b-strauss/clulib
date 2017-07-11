goog.provide('clulib.dom.test');

goog.require('clulib.dom');

clulib.dom.test.main = () => {
  describe('clulib.dom', () => {
    describe('matches', () => {
      it('should return true if the element would be selected by the specified selector string', () => {
        const element = document.createElement('div');
        element.id = 'id-selector';
        element.classList.add('class-selector');

        expect(clulib.dom.matches(element, '#id-selector.class-selector')).toBe(true);
      });

      it('should return false if the element would not be selected by the specified selector string', () => {
        const element = document.createElement('div');

        expect(clulib.dom.matches(element, '#some-id')).toBe(false);
      });
    });
  });
};