goog.provide('clulib.async.Completer.test');

goog.require('clulib.async.Completer');

clulib.async.Completer.test.main = () => {
  describe('clulib.async.Completer', () => {
    it('should resolve its promise', done => {
      const completer = new clulib.async.Completer();
      const result = 'result';

      completer.getPromise()
        .then(r => {
          expect(r).toBe(result);
          done();
        });

      completer.resolve(result);
    });

    it('should reject its promise', done => {
      const completer = new clulib.async.Completer();
      const error = 'error';

      completer.getPromise()
        .catch(e => {
          expect(e).toBe(error);
          done();
        });

      completer.reject(error);
    });

    it('should know if its promise has completed', done => {
      const completer = new clulib.async.Completer();

      completer.getPromise()
        .then(() => {
          expect(completer.hasCompleted()).toBe(true);
          done();
        });

      completer.resolve();
    });
  });
};
