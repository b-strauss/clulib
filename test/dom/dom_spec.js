goog.module('test.clulib.dom');

const cluDom = goog.require('clulib.dom');

const googDom = goog.require('goog.dom');

exports = function () {
  describe('clulib.dom', () => {
    describe('matches', () => {
      it('should return true if the element would be selected by the specified selector string', () => {
        const element = document.createElement('div');
        element.id = 'id-selector';
        element.classList.add('class-selector');

        expect(cluDom.matches(element, '#id-selector.class-selector')).toBe(true);
      });

      it('should return false if the element would not be selected by the specified selector string', () => {
        const element = document.createElement('div');

        expect(cluDom.matches(element, '#some-id')).toBe(false);
      });
    });

    describe('closest', () => {
      it('should return the element itself if the selector matches', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div class="cls">
            <div class="cls origin" id="target"></div>
          </div>
        `;
        const origin = container.querySelector('.origin');
        const foundId = cluDom.closest(origin, '.cls').id;

        expect(foundId).toBe('target');
      });

      it('should return the closest ancestor that matches the selector', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div class="cls" id="target">
            <div>
              <div id="origin"></div>
            </div>
          </div>
        `;
        const origin = container.querySelector('#origin');
        const foundId = cluDom.closest(origin, '.cls').id;

        expect(foundId).toBe('target');
      });

      it('should return null if nothing matches', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div>
            <div>
              <div id="origin"></div>
            </div>
          </div>
        `;
        const origin = container.querySelector('#origin');
        const foundObject = cluDom.closest(origin, '.cls');

        expect(foundObject).toBe(null);
      });

      it('should return null if nothing matches in document context', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div>
            <div>
              <div id="origin"></div>
            </div>
          </div>
        `;

        googDom.appendChild(document.body, container);

        const origin = container.querySelector('#origin');
        const foundObject = cluDom.closest(origin, '.cls');

        expect(foundObject).toBe(null);

        googDom.removeNode(container);
      });
    });
  });
};
