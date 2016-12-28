goog.provide('clulib.sdks');

goog.require('clulib.async.Completer');

goog.require('goog.dom');

/**
 * For locales see {@link https://developers.facebook.com/docs/internationalization}
 *
 * @param {string=} opt_locale
 * @returns {Promise}
 */
clulib.sdks.loadFacebookSdk = function (opt_locale) {
  const locale = opt_locale || 'en_US';
  const fbObject = window['FB'];

  if (fbObject != null)
    return Promise.resolve(fbObject);

  const completer = new clulib.async.Completer();

  window['fbAsyncInit'] = function () {
    window['fbAsyncInit'] = null;

    completer.resolve(window['FB']);
  };

  const firstScript = document.querySelector('script');
  /**
   * @type {HTMLScriptElement}
   */
  const fbScript = /** @type {HTMLScriptElement} */ (document.createElement('script'));
  fbScript.src = `https://connect.facebook.net/${locale}/sdk.js`;

  goog.dom.insertSiblingBefore(fbScript, firstScript);

  return completer.getPromise();
};