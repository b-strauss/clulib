goog.module('test.clulib.animation.rendering');

const {listen} = goog.require('goog.events');

const {RenderLoop, RenderLoopEventType, waitForFrames, throttle} = goog.require('clulib.animation.rendering');

const {waitFor} = goog.require('testing.async');
const {tick} = goog.require('testing.animation');

exports = function () {
  describe('clulib.animation.rendering', () => {
    describe('RenderLoop', () => {
      it('should dispatch tick events', async () => {
        const loop = new RenderLoop();
        let started = false;
        let ticked = false;
        let ended = false;
        let elapsedTime = 0;

        listen(loop, RenderLoopEventType.START, () => {
          started = true;
        });

        listen(loop, RenderLoopEventType.TICK, event => {
          ticked = true;
          elapsedTime = event.elapsedTime;
          loop.stop();
        });

        listen(loop, RenderLoopEventType.END, () => {
          ended = true;
        });

        loop.start();

        await waitFor(1000);

        expect(started).toBe(true);
        expect(ticked).toBe(true);
        expect(ended).toBe(true);
        expect(elapsedTime > 0).toBe(true);
      });
    });

    describe('waitForFrames', () => {
      it('should wait for a certain number of browser repaints', async () => {
        let ticks = 0;
        let callId = null;

        function tick () {
          ticks++;
          callId = window.requestAnimationFrame(tick);
        }

        callId = window.requestAnimationFrame(tick);

        await waitForFrames(3);
        window.cancelAnimationFrame(/** @type {number} */ (callId));

        expect(ticks).toBe(3);
      });
    });

    describe('throttle', () => {
      it('should throttle a function to be only called on repaint', async () => {
        let calls = 0;
        let throttledFunction = throttle(() => {
          calls++;
        });

        expect(calls).toBe(0);

        throttledFunction();
        throttledFunction();
        throttledFunction();

        expect(calls).toBe(0);

        await tick();

        expect(calls).toBe(1);

        throttledFunction();
        throttledFunction();
        throttledFunction();

        expect(calls).toBe(1);

        await tick();

        expect(calls).toBe(2);
      });

      it('should pass arguments to the inner function', async () => {
        let argument = null;
        let throttledFunction = throttle(x => {
          argument = x;
        });

        throttledFunction(5);

        expect(argument).toBe(null);

        await tick();

        expect(argument).toBe(5);
      });
    });
  });
};
