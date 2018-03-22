goog.module('test.clulib.animation.rendering');

const {RenderLoop, RenderLoopEventType} = goog.require('clulib.animation.rendering');
const {waitFor} = goog.require('testing.async');

const {listen} = goog.require('goog.events');

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
  });
};
