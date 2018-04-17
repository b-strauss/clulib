goog.module('test.clulib.dom');

const {appendChild, removeNode, getViewportSize} = goog.require('goog.dom');

const {matches, closest, isElementVisible} = goog.require('clulib.dom');

exports = function () {
  describe('clulib.dom', () => {
    describe('matches', () => {
      it('should return true if the element would be selected by the specified selector string', () => {
        const element = document.createElement('div');
        element.id = 'id-selector';
        element.classList.add('class-selector');

        expect(matches(element, '#id-selector.class-selector')).toBe(true);
      });

      it('should return false if the element would not be selected by the specified selector string', () => {
        const element = document.createElement('div');

        expect(matches(element, '#some-id')).toBe(false);
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
        const foundId = closest(origin, '.cls').id;

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
        const foundId = closest(origin, '.cls').id;

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
        const foundObject = closest(origin, '.cls');

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

        appendChild(document.body, container);

        const origin = container.querySelector('#origin');
        const foundObject = closest(origin, '.cls');

        expect(foundObject).toBe(null);

        removeNode(container);
      });
    });

    describe('isElementVisible', () => {
      /**
       * @type {goog.math.Size}
       */
      const viewportSize = getViewportSize();

      const fakeFullyVisible = {
        ['getBoundingClientRect'] () {
          return {
            'left': viewportSize.width / 4,
            'top': viewportSize.height / 4,
            'width': viewportSize.width / 2,
            'height': viewportSize.height / 2
          };
        }
      };

      const fakeQuarterVisible = {
        ['getBoundingClientRect'] () {
          return {
            'left': viewportSize.width / 2,
            'top': viewportSize.height / 2,
            'width': viewportSize.width,
            'height': viewportSize.height
          };
        }
      };

      const fakeNotVisible = {
        ['getBoundingClientRect'] () {
          return {
            'left': 0,
            'top': viewportSize.height * 2,
            'width': viewportSize.width,
            'height': viewportSize.height
          };
        }
      };

      const fakeNotVisibleOnEdge = {
        ['getBoundingClientRect'] () {
          return {
            'left': 0,
            'top': viewportSize.height,
            'width': viewportSize.width,
            'height': viewportSize.height
          };
        }
      };

      it('should detect fully visible elements', () => {
        expect(isElementVisible(/** @type {?} */ (fakeFullyVisible))).toBe(true);
        expect(isElementVisible(/** @type {?} */ (fakeFullyVisible), 1)).toBe(true);
      });

      it('should detect partially visible elements', () => {
        expect(isElementVisible(/** @type {?} */ (fakeQuarterVisible))).toBe(true);
        expect(isElementVisible(/** @type {?} */ (fakeQuarterVisible), .23)).toBe(true);
        expect(isElementVisible(/** @type {?} */ (fakeQuarterVisible), .25)).toBe(true);
        expect(isElementVisible(/** @type {?} */ (fakeQuarterVisible), .26)).toBe(false);
      });

      it('should not detect non visible elements', () => {
        expect(isElementVisible(/** @type {?} */ (fakeNotVisible))).toBe(false);
      });

      it('should not detect non visible elements on edge', () => {
        expect(isElementVisible(/** @type {?} */ (fakeNotVisibleOnEdge))).toBe(false);
      });
    });
  });
};
