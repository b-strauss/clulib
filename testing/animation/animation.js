goog.module('testing.animation');

function tick () {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
}

exports = {tick};
