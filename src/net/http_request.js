goog.module('clulib.net.http_request');

const Completer = goog.require('clulib.async.Completer');
const events = goog.require('goog.events');
const XhrIo = goog.require('goog.net.XhrIo');
const EventType = goog.require('goog.net.EventType');
const ResponseType = goog.require('goog.net.XhrIo.ResponseType');

/**
 * @typedef {{
 *   response: *,
 *   responseHeaders: !IObject<string, string>
 * }}
 */
// eslint-disable-next-line init-declarations
let HttpResult;

/**
 * @typedef {{
 *   promise: Promise<HttpResult>,
 *   cancel: function():void
 * }}
 */
// eslint-disable-next-line init-declarations
let RequestControls;

/**
 * Creates and sends a url HTTP request for the specified [url].
 *
 * By default `request` will perform an HTTP GET request, but a different
 * method (`POST`, `PUT`, `DELETE`, etc) can be used by specifying the
 * [method] parameter.
 *
 * Returns an object with a property [promise] and [cancel] function.
 *
 * The Promise is completed when the response is available. Cancel
 * can be used to abort the request. The Promise will be rejected with an
 * abort event.
 *
 * @param {string} url The url to send the request to
 * @param {string=} method The request method
 * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=} content The request content
 * @param {string|goog.net.XhrIo.ResponseType=} responseType The type of the response
 * @param {function(!ProgressEvent)|null=} onUpload A function to be called for the upload progress
 * @param {function(!ProgressEvent)|null=} onDownload A function to be called for the download progress
 * @param {boolean=} withCredentials If the request should send credentials, only useful for cross-origin requests
 * @param {IObject<string, string>=} headers Headers to be send
 * @param {number=} timeoutInterval The time in milliseconds after which an incomplete request will be aborted
 * @returns {RequestControls}
 * An object containing the result promise and an abort function
 */
function httpRequest (url, method = 'GET', content = null, responseType = '', onUpload = null, onDownload = null,
  withCredentials = false, headers = null, timeoutInterval = 0) {

  const completer = new Completer();

  /**
   * @type {goog.net.XhrIo}
   */
  const xhr = new XhrIo();

  xhr.setResponseType(/** @type {goog.net.XhrIo.ResponseType} */ (responseType));
  xhr.setWithCredentials(withCredentials);
  xhr.setTimeoutInterval(timeoutInterval);
  xhr.setProgressEventsEnabled(onUpload != null || onDownload != null);

  xhr.listenOnce(EventType.SUCCESS, () => {
    events.removeAll(xhr);
    completer.resolve({
      response: xhr.getResponse(),
      responseHeaders: xhr.getResponseHeaders()
    });
  });

  if (onUpload != null)
    xhr.listen(EventType.UPLOAD_PROGRESS, onUpload);

  if (onDownload != null)
    xhr.listen(EventType.DOWNLOAD_PROGRESS, onDownload);

  function reject (event) {
    events.removeAll(xhr);
    completer.reject(event);
  }

  xhr.listenOnce(EventType.ERROR, reject);
  xhr.listenOnce(EventType.TIMEOUT, reject);
  xhr.listenOnce(EventType.ABORT, reject);

  xhr.send(url, method, content, headers);

  return {
    promise: completer.getPromise(),
    cancel: () => {
      xhr.abort();
    }
  };
}

/**
 * A simple method for creating a get request to retrieve text content.
 *
 * @param {string} url The url to retrieve the content from
 * @returns {RequestControls}
 * An object containing the result promise and an abort function
 */
function httpGetText (url) {
  return httpRequest(url, 'GET', null, ResponseType.TEXT);
}

/**
 * A simple method for creating a get request to retrieve JSON content.
 *
 * @param {string} url The url to retrieve the content from
 * @returns {RequestControls}
 * An object containing the result promise and an abort function
 */
function httpGetJson (url) {
  const request = httpRequest(url, 'GET', null, ResponseType.TEXT);

  return {
    promise: request.promise.then(({response, responseHeaders}) => {
      return {
        response: JSON.parse(/** @type {string} */ (response)),
        responseHeaders
      };
    }),
    cancel: request.cancel
  };
}

exports = {httpRequest, httpGetText, httpGetJson, HttpResult, RequestControls};
