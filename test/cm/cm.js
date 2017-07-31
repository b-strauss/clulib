goog.module('test.clulib.cm');

const ComponentManager = goog.require('clulib.cm.ComponentManager');
const BaseComponent = goog.require('clulib.cm.Component');

const dom = goog.require('goog.dom');
const classlist = goog.require('goog.dom.classlist');
const dataset = goog.require('goog.dom.dataset');

exports = function () {
  describe('clulib.cm.ComponentManager', () => {
    /**
     * @type {?Element}
     */
    let container = null;
    
    beforeEach(() => {
      container = addDummyHtml();
    });
    
    afterEach(() => {
      removeDummyHtml(container);
      container = null;
    });
    
    it('should use specific attributes for decoration', () => {
      const manager = new ComponentManager();
      
      expect(manager.getTypeAttribute()).toBe('data-cmp');
      expect(manager.getIdAttribute()).toBe('data-cmp-id');
      expect(manager.getConfigAttribute()).toBe('data-cmp-cfg');
    });
    
    it('should accept a component for registration', () => {
      const manager = new ComponentManager();
      const component = createDummyComponent();
      
      manager.addComponent('foo', component);
      
      expect(manager.getRegistry().get('foo')).toBe(component);
    });
    
    it('should accept multiple components for registration', () => {
      const manager = new ComponentManager();
      const component1 = createDummyComponent();
      const component2 = createDummyComponent();
      const component3 = createDummyComponent();
      const component4 = createDummyComponent();
      
      manager.addComponentMap({
        'one': component1,
        'two': component2,
        'three': component3,
        'four': component4
      });
      
      expect(manager.getRegistry().get('one')).toBe(component1);
      expect(manager.getRegistry().get('two')).toBe(component2);
      expect(manager.getRegistry().get('three')).toBe(component3);
      expect(manager.getRegistry().get('four')).toBe(component4);
    });
    
    it('should decorate dom elements with components', async done => {
      const manager = new ComponentManager();
      
      let init1 = false;
      let init2 = false;
      
      const component1 = createDummyComponent(null, component => {
        init1 = classlist.contains(component.getElement(), 'outer');
      });
      const component2 = createDummyComponent(null, component => {
        init2 = classlist.contains(component.getElement(), 'inner');
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      await manager.decorate(container);
      
      expect(init1).toBe(true);
      expect(init2).toBe(true);
      
      manager.disposeAll();
      done();
    });
    
    it('should return the component for an element', async done => {
      const manager = new ComponentManager();
      
      let instance = null;
      
      const component = createDummyComponent(null, component => {
        instance = component;
      });
      
      manager.addComponentMap({
        'outer': component,
        'inner': createDummyComponent()
      });
      
      await manager.decorate(container);
      
      const foundInstance = manager.getComponentForElement(container.querySelector('.outer'));
      expect(foundInstance).toBe(instance);
      
      manager.disposeAll();
      done();
    });
    
    it('should return components for an array of elements', async done => {
      const manager = new ComponentManager();
      
      let instance1 = null;
      const component1 = createDummyComponent(null, cmp => {
        instance1 = cmp;
      });
      
      let instance2 = null;
      const component2 = createDummyComponent(null, cmp => {
        instance2 = cmp;
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      await manager.decorate(container);
      
      const elements = [
        container.querySelector('.outer'),
        container.querySelector('.inner')
      ];
      
      const foundInstances = manager.getComponentsForElementArray(elements);
      expect(foundInstances[0]).toBe(instance1);
      expect(foundInstances[1]).toBe(instance2);
      
      manager.disposeAll();
      done();
    });
    
    it('should return a component by selector', async done => {
      const manager = new ComponentManager();
      
      let instance = null;
      
      const component = createDummyComponent(null, component => {
        instance = component;
      });
      
      manager.addComponentMap({
        'outer': component,
        'inner': createDummyComponent()
      });
      
      await manager.decorate(container);
      
      const foundInstance = manager.queryComponent('.outer');
      
      expect(foundInstance).toBe(instance);
      
      manager.disposeAll();
      done();
    });
    
    it('should return multiple components by selector', async done => {
      const manager = new ComponentManager();
      
      let instance1 = null;
      const component1 = createDummyComponent(null, cmp => {
        instance1 = cmp;
      });
      
      let instance2 = null;
      const component2 = createDummyComponent(null, cmp => {
        instance2 = cmp;
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      await manager.decorate(container);
      
      const foundInstances = manager.queryComponentAll('.outer, .inner');
      
      expect(foundInstances[0]).toBe(instance1);
      expect(foundInstances[1]).toBe(instance2);
      
      manager.disposeAll();
      done();
    });
    
    it('should initialize components in tree order', async done => {
      const manager = new ComponentManager();
      
      let output = '';
      
      let instance1 = null;
      const component1 = createDummyComponent(null, cmp => {
        instance1 = cmp;
        output += 'outer';
      });
      
      let instance2 = null;
      const component2 = createDummyComponent(null, cmp => {
        instance2 = cmp;
        output += 'inner';
      }, null, () => {
        return new Promise(resolve => {
          setTimeout(() => resolve(), 100);
        });
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      await manager.decorate(container);
      
      expect(output).toBe('innerouter');
      
      manager.disposeAll();
      done();
    });
    
    it('should dispose all components', async done => {
      const manager = new ComponentManager();
      
      manager.addComponentMap({
        'outer': createDummyComponent(),
        'inner': createDummyComponent()
      });
      
      await manager.decorate(container);
      
      expect(dataset.has(container.querySelector('.outer'), 'cmpId')).toBe(true);
      expect(dataset.has(container.querySelector('.inner'), 'cmpId')).toBe(true);
      
      manager.disposeAll();
      
      expect(dataset.has(container.querySelector('.outer'), 'cmpId')).toBe(false);
      expect(dataset.has(container.querySelector('.inner'), 'cmpId')).toBe(false);
      
      done();
    });
  });
};

/**
 * @param {(function(BaseComponent=):void|null)=} constructorFn
 * @param {(function(BaseComponent=):void|null)=} onInitFn
 * @param {(function(BaseComponent=):void|null)=} onDisposeFn
 * @param {(function():Promise|null)=} waitForFn
 * @returns {function(new:BaseComponent)}
 */
function createDummyComponent (constructorFn = null, onInitFn = null, onDisposeFn = null, waitForFn = null) {
  waitForFn = waitForFn || (() => Promise.resolve());
  
  /**
   * @constructor
   * @extends {BaseComponent}
   */
  const Component = function () {
    Component.base(this, 'constructor');
    
    if (constructorFn != null)
      constructorFn(this);
  };
  
  goog.inherits(Component, BaseComponent);
  
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
      onInitFn(this);
  };
  
  Component.prototype.onDispose = function () {
    Component.base(this, 'onDispose');
    if (onDisposeFn != null)
      onDisposeFn(this);
  };
  
  return Component;
}

/**
 * @returns {Element}
 */
function addDummyHtml () {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="outer" data-cmp="outer" data-cfg="eyJkYXRhIjoiYWJjIn0=">
      <div class="middle">
        <div class="inner" data-cmp="inner"></div>
      </div>
    </div>
  `;
  
  dom.appendChild(document.body, container);
  
  return container;
}

/**
 * @param {Element} element
 */
function removeDummyHtml (element) {
  dom.removeNode(element);
}
