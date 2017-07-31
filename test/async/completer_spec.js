goog.module('test.clulib.async.Completer');

const Completer = goog.require('clulib.async.Completer');

exports = function () {
  describe('clulib.async.Completer', () => {
    it('should resolve its promise', done => {
      const com = new Completer();
      const result = 'result';
      
      com.getPromise()
        .then(r => {
          expect(r).toBe(result);
          done();
        });
      
      com.resolve(result);
    });
    
    it('should reject its promise', done => {
      const com = new Completer();
      const error = 'error';
      
      com.getPromise()
        .catch(e => {
          expect(e).toBe(error);
          done();
        });
      
      com.reject(error);
    });
    
    it('should know if its promise has completed', done => {
      const com = new Completer();
      
      com.getPromise()
        .then(() => {
          expect(com.hasCompleted()).toBe(true);
          done();
        });
      
      com.resolve();
    });
  });
};
