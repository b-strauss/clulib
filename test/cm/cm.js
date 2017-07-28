goog.provide('clulib.cm.test');

goog.require('clulib.cm.ComponentManager');
goog.require('clulib.cm.Component');

goog.require('goog.dom');
goog.require('goog.structs.Map');

clulib.cm.test.main = () => {
  describe('clulib.cm.ComponentManager', () => {
    it('should use specific attributes for decoration', () => {
      const manager = new clulib.cm.ComponentManager();

      expect(manager.getTypeAttribute()).toBe('data-cmp');
      expect(manager.getIdAttribute()).toBe('data-cmp-id');
      expect(manager.getConfigAttribute()).toBe('data-cmp-cfg');
    });

    it('should accept a component for registration', () => {
      const manager = new clulib.cm.ComponentManager();
      const component = clulib.cm.test.createDummyComponent();

      manager.addComponent('foo', component);

      expect(manager.getRegistry().get('foo')).toBe(component);
    });

    it('should accept multiple components for registration', () => {
      const manager = new clulib.cm.ComponentManager();
      const component1 = clulib.cm.test.createDummyComponent();
      const component2 = clulib.cm.test.createDummyComponent();
      const component3 = clulib.cm.test.createDummyComponent();
      const component4 = clulib.cm.test.createDummyComponent();

      manager.addComponentMap({
        'one': component1,
        'two': component2
      });

      manager.addComponentMap(new goog.structs.Map({
        'three': component3,
        'four': component4
      }));

      expect(manager.getRegistry().get('one')).toBe(component1);
      expect(manager.getRegistry().get('two')).toBe(component2);
      expect(manager.getRegistry().get('three')).toBe(component3);
      expect(manager.getRegistry().get('four')).toBe(component4);
    });
  });
};

/**
 * @param {Function=} constructorFn
 * @param {Function=} onInitFn
 * @param {Function=} onDisposeFn
 * @param {(function():Promise|null)=} waitForFn
 * @returns {function(new:clulib.cm.Component)}
 */
clulib.cm.test.createDummyComponent = (constructorFn = null, onInitFn = null, onDisposeFn = null,
  waitForFn = null) => {
  waitForFn = waitForFn || (() => Promise.resolve());

  /**
   * @constructor
   * @extends {clulib.cm.Component}
   */
  const Component = function () {
    Component.base(this, 'constructor');

    if (constructorFn != null)
      constructorFn();
  };

  goog.inherits(Component, clulib.cm.Component);

  /**
   * @returns {Promise}
   */
  Component.prototype.waitFor = function () {
    return Promise.all([
      Component.base(this, 'waitFor'),
      waitForFn()
    ]);
  };

  Component.prototype.onInit = function () {
    Component.base(this, 'onInit');
    if (onInitFn != null)
      onInitFn();
  };

  Component.prototype.onDispose = function () {
    Component.base(this, 'onDispose');
    if (onDisposeFn != null)
      onDisposeFn();
  };

  return Component;
};

/**
 * @returns {Element}
 */
clulib.cm.test.addDummyHtml = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="outer" data-cmp="outer">
      <div class="middle">
        <div class="inner" data-cmp="inner"></div>
      </div>
    <div>
  `;

  goog.dom.appendChild(document.body, container);

  return container;
};

/**
 * @param {Element} element
 */
clulib.cm.test.removeDummyHtml = element => {
  goog.dom.removeNode(element);
};
