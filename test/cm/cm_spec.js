goog.module('test.clulib.cm');

const {ComponentManager, Component} = goog.require('clulib.cm');

const {appendChild, removeNode, getFirstElementChild} = goog.require('goog.dom');
const {contains} = goog.require('goog.dom.classlist');
const {has} = goog.require('goog.dom.dataset');

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

      expect(manager.getRegistry().size).toBe(1);
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

      expect(manager.getRegistry().size).toBe(4);
      expect(manager.getRegistry().get('one')).toBe(component1);
      expect(manager.getRegistry().get('two')).toBe(component2);
      expect(manager.getRegistry().get('three')).toBe(component3);
      expect(manager.getRegistry().get('four')).toBe(component4);
    });

    it('should accept a class with metadata for registration and initialization', () => {
      const manager = new ComponentManager();
      const component = createDummyComponent(null, null, null, null, {
        type: 'inner'
      });

      manager.addClass(component);
      manager.addComponent('outer', createDummyComponent());

      expect(manager.getRegistry().get('inner')).toBe(component);
    });

    it('should fail initialization on a class with selector metadata that doesn\'t match its elements selector',
      async () => {
        const manager = new ComponentManager();
        const component = createDummyComponent(null, null, null, null, {
          type: 'inner',
          selector: 'button'
        });

        manager.addClass(component);
        manager.addComponent('outer', createDummyComponent());

        let error = null;

        try {
          await manager.decorate(container);
        } catch (e) {
          error = e;
        } finally {
          expect(error).toBeDefined();
          expect(error.message)
            .toBe('Component type \'inner\' can only be decorated on elements that match selector \'button\'.');
        }
      }
    );

    it('should decorate dom elements with components', async () => {
      const manager = new ComponentManager();

      let init1 = false;
      let init2 = false;

      const component1 = createDummyComponent(null, component => {
        init1 = contains(component.getElement(), 'outer');
      });
      const component2 = createDummyComponent(null, component => {
        init2 = contains(component.getElement(), 'inner');
      });

      manager.addComponentMap({
        'outer': component1,
        'inner': component2
      });

      await manager.decorate(container);

      expect(init1).toBe(true);
      expect(init2).toBe(true);

      manager.disposeAll();
    });

    it('should return the component for an element', async () => {
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
    });

    it('should return components for an array of elements', async () => {
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
    });

    it('should return a component by selector', async () => {
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
    });

    it('should return multiple components by selector', async () => {
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
    });

    it('should initialize components in tree order', async () => {
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
    });

    it('should initialize a component after waitFor', async () => {
      const manager = new ComponentManager();

      let output = '';

      const component = createDummyComponent(null, () => {
        output += 'init';
      }, null, () => {
        return new Promise(resolve => {
          setTimeout(() => {
            output += 'waitFor';
            resolve();
          }, 100);
        });
      });

      manager.addComponentMap({
        'outer': component,
        'inner': createDummyComponent()
      });

      await manager.decorate(container);

      expect(output).toBe('waitForinit');

      manager.disposeAll();
    });

    it('should not change the dom tree on decoration', async () => {
      const manager = new ComponentManager();

      manager.addComponentMap({
        'outer': createDummyComponent(),
        'inner': createDummyComponent()
      });

      await manager.decorate(container);

      const outerElement = container.querySelector('.outer');
      const middleElement = getFirstElementChild(outerElement);
      const innerElement = getFirstElementChild(middleElement);

      expect(contains(outerElement, 'outer')).toBe(true);
      expect(contains(middleElement, 'middle')).toBe(true);
      expect(contains(innerElement, 'inner')).toBe(true);

      manager.disposeAll();
    });

    it('should load the json config of a component', async () => {
      const manager = new ComponentManager();

      manager.addComponentMap({
        'outer': createDummyComponent(null, instance => {
          const config = instance.getConfig();
          expect(config['data']).toBe('abc');
        }),
        'inner': createDummyComponent()
      });

      await manager.decorate(container);

      manager.disposeAll();
    });

    it('should dispose all components', async () => {
      const manager = new ComponentManager();

      let output = '';

      manager.addComponentMap({
        'outer': createDummyComponent(null, null, () => {
          output += 'outer';
        }),
        'inner': createDummyComponent(null, null, () => {
          output += 'inner';
        })
      });

      await manager.decorate(container);

      expect(has(container.querySelector('.outer'), 'cmpId')).toBe(true);
      expect(has(container.querySelector('.inner'), 'cmpId')).toBe(true);

      manager.disposeAll();

      expect(output).toBe('outerinner');

      expect(has(container.querySelector('.outer'), 'cmpId')).toBe(false);
      expect(has(container.querySelector('.inner'), 'cmpId')).toBe(false);
    });
  });
};

/**
 * @param {(function(Component=):void|null)=} constructorFn
 * @param {(function(Component=):void|null)=} onInitFn
 * @param {(function(Component=):void|null)=} onDisposeFn
 * @param {(function():Promise|null)=} waitForFn
 * @param {(?clulib.cm.ComponentMetadata)=} metadata
 * @returns {clulib.cm.ComponentType}
 */
function createDummyComponent (constructorFn = null, onInitFn = null, onDisposeFn = null, waitForFn = null,
  metadata = null) {
  waitForFn = waitForFn || (() => Promise.resolve());

  class DummyComponent extends Component {
    constructor () {
      super();

      if (constructorFn != null)
        constructorFn(this);
    }

    /**
     * @inheritDoc
     */
    waitFor () {
      return Promise.all([
        super.waitFor(),
        waitForFn()
      ]);
    }

    /**
     * @inheritDoc
     */
    onInit () {
      super.onInit();
      if (onInitFn != null)
        onInitFn(this);
    }

    /**
     * @inheritDoc
     */
    onDispose () {
      super.onDispose();
      if (onDisposeFn != null)
        onDisposeFn(this);
    }
  }

  DummyComponent.Metadata = metadata;

  return DummyComponent;
}

/**
 * @returns {Element}
 */
function addDummyHtml () {
  const container = document.createElement('div');
  // data-cmp-cfg is the object {data: "abc"}
  container.innerHTML = `
    <div class="outer" data-cmp="outer" data-cmp-cfg="eyJkYXRhIjoiYWJjIn0=">
      <div class="middle">
        <div class="inner" data-cmp="inner"></div>
      </div>
    </div>
  `;

  appendChild(document.body, container);

  return container;
}

/**
 * @param {Element} element
 */
function removeDummyHtml (element) {
  removeNode(element);
}
