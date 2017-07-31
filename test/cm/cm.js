goog.provide('clulib.cm.test');

goog.require('clulib.cm.ComponentManager');
goog.require('clulib.cm.Component');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');

clulib.cm.test.main = () => {
  describe('clulib.cm.ComponentManager', () => {
    /**
     * @type {?Element}
     */
    let container = null;
    
    beforeEach(() => {
      container = clulib.cm.test.addDummyHtml();
    });
    
    afterEach(() => {
      clulib.cm.test.removeDummyHtml(container);
      container = null;
    });
    
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
        'two': component2,
        'three': component3,
        'four': component4
      });
      
      expect(manager.getRegistry().get('one')).toBe(component1);
      expect(manager.getRegistry().get('two')).toBe(component2);
      expect(manager.getRegistry().get('three')).toBe(component3);
      expect(manager.getRegistry().get('four')).toBe(component4);
    });
    
    it('should decorate dom elements with components', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let init1 = false;
      let init2 = false;
      
      const component1 = clulib.cm.test.createDummyComponent(null, component => {
        init1 = goog.dom.classlist.contains(component.getElement(), 'outer');
      });
      const component2 = clulib.cm.test.createDummyComponent(null, component => {
        init2 = goog.dom.classlist.contains(component.getElement(), 'inner');
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      manager.decorate(container)
        .then(() => {
          expect(init1).toBe(true);
          expect(init2).toBe(true);
          
          manager.disposeAll();
          done();
        });
    });
    
    it('should return the component for an element', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let instance = null;
      
      const component = clulib.cm.test.createDummyComponent(null, component => {
        instance = component;
      });
      
      manager.addComponentMap({
        'outer': component,
        'inner': clulib.cm.test.createDummyComponent()
      });
      
      manager.decorate(container)
        .then(() => {
          const foundInstance = manager.getComponentForElement(container.querySelector('.outer'));
          
          expect(foundInstance).toBe(instance);
          
          manager.disposeAll();
          done();
        });
    });
    
    it('should return components for an array of elements', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let instance1 = null;
      const component1 = clulib.cm.test.createDummyComponent(null, cmp => {
        instance1 = cmp;
      });
      
      let instance2 = null;
      const component2 = clulib.cm.test.createDummyComponent(null, cmp => {
        instance2 = cmp;
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      manager.decorate(container)
        .then(() => {
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
    });
    
    it('should return a component by selector', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let instance = null;
      
      const component = clulib.cm.test.createDummyComponent(null, component => {
        instance = component;
      });
      
      manager.addComponentMap({
        'outer': component,
        'inner': clulib.cm.test.createDummyComponent()
      });
      
      manager.decorate(container)
        .then(() => {
          const foundInstance = manager.queryComponent('.outer');
          
          expect(foundInstance).toBe(instance);
          
          manager.disposeAll();
          done();
        });
    });
    
    it('should return multiple components by selector', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let instance1 = null;
      const component1 = clulib.cm.test.createDummyComponent(null, cmp => {
        instance1 = cmp;
      });
      
      let instance2 = null;
      const component2 = clulib.cm.test.createDummyComponent(null, cmp => {
        instance2 = cmp;
      });
      
      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });
      
      manager.decorate(container)
        .then(() => {
          const foundInstances = manager.queryComponentAll('.outer, .inner');
          
          expect(foundInstances[0]).toBe(instance1);
          expect(foundInstances[1]).toBe(instance2);
          
          manager.disposeAll();
          done();
        });
    });
    
    it('should initialize components in tree order', done => {
      const manager = new clulib.cm.ComponentManager();
      
      let output = '';
      
      let instance1 = null;
      const component1 = clulib.cm.test.createDummyComponent(null, cmp => {
        instance1 = cmp;
        output += 'outer';
      });
      
      let instance2 = null;
      const component2 = clulib.cm.test.createDummyComponent(null, cmp => {
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
      
      manager.decorate(container)
        .then(() => {
          expect(output).toBe('innerouter');
          
          manager.disposeAll();
          done();
        });
    });
    
    it('should dispose all components', done => {
      const manager = new clulib.cm.ComponentManager();
      
      manager.addComponentMap({
        'outer': clulib.cm.test.createDummyComponent(),
        'inner': clulib.cm.test.createDummyComponent()
      });
      
      manager.decorate(container)
        .then(() => {
          expect(goog.dom.dataset.has(container.querySelector('.outer'), 'cmpId')).toBe(true);
          expect(goog.dom.dataset.has(container.querySelector('.inner'), 'cmpId')).toBe(true);
          
          manager.disposeAll();
          
          expect(goog.dom.dataset.has(container.querySelector('.outer'), 'cmpId')).toBe(false);
          expect(goog.dom.dataset.has(container.querySelector('.inner'), 'cmpId')).toBe(false);
          
          done();
        });
    });
  });
};

/**
 * @param {(function(clulib.cm.Component=):void|null)=} constructorFn
 * @param {(function(clulib.cm.Component=):void|null)=} onInitFn
 * @param {(function(clulib.cm.Component=):void|null)=} onDisposeFn
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
      constructorFn(this);
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
      onInitFn(this);
  };
  
  Component.prototype.onDispose = function () {
    Component.base(this, 'onDispose');
    if (onDisposeFn != null)
      onDisposeFn(this);
  };
  
  return Component;
};

/**
 * @returns {Element}
 */
clulib.cm.test.addDummyHtml = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="outer" data-cmp="outer" data-cfg="eyJkYXRhIjoiYWJjIn0=">
      <div class="middle">
        <div class="inner" data-cmp="inner"></div>
      </div>
    </div>
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
