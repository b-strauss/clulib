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

/**
 * For locales see {@link https://developers.google.com/+/web/api/supported-languages}
 *
 * @param {string=} opt_pageId
 * @param {string=} opt_locale
 * @returns {Promise}
 */
clulib.sdks.loadGooglePlusSdk = function (opt_pageId, opt_locale) {
  const locale = opt_locale || 'en-US';
  let pageInfo = '';

  if (opt_pageId != null)
    pageInfo = '&publisherid=' + opt_pageId;

  const gapiObject = window['gapi'];
  const initName = 'googAsyncInit';

  if (gapiObject != null)
    return Promise.resolve(gapiObject);

  const completer = new clulib.async.Completer();

  window[initName] = function () {
    window[initName] = null;

    completer.resolve(window['gapi']);
  };

  window['___gcfg'] = {
    'lang': locale
  };

  const firstScript = document.querySelector('script');
  /**
   * @type {HTMLScriptElement}
   */
  const googScript = /** @type {HTMLScriptElement} */ (document.createElement('script'));
  googScript.src = 'https://apis.google.com/js/platform.js?onload=' + initName + pageInfo;

  goog.dom.insertSiblingBefore(googScript, firstScript);

  return completer.getPromise();
};