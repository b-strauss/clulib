goog.module('clulib.l10n.ResourceBundle');

const {objectToMap} = goog.require('clulib.collections');
const {cacheAsyncValue} = goog.require('clulib.functions');
const {httpGetJson} = goog.require('clulib.net.http_request');

/**
 * A resource bundle containing localized messages.
 *
 * Loads json localization files via pattern `baseUrl/locale/id.json`
 */
class ResourceBundle {
  /**
   * @param {string} id
   * @param {string} locale
   * @param {string} baseUrl
   */
  constructor (id, locale, baseUrl) {
    /**
     * @type {string}
     * @private
     */
    this.id_ = id;

    /**
     * @type {string}
     * @private
     */
    this.locale_ = locale;

    /**
     * @type {string}
     * @private
     */
    this.baseUrl_ = baseUrl;

    /**
     * @type {boolean}
     * @private
     */
    this.loaded_ = false;

    /**
     * @type {Map<string, *>}
     * @private
     */
    this.data_ = null;

    /**
     * @type {function():Promise<clulib.net.http_request.HttpResult>}
     * @private
     */
    this.loadJson_ = cacheAsyncValue(() => {
      const url = `${this.baseUrl_}/${this.locale_}/${this.id_}.json`;
      return httpGetJson(url).promise;
    });
  }

  /**
   * @returns {string}
   */
  get id () {
    return this.id_;
  }

  /**
   * @returns {string}
   */
  get locale () {
    return this.locale_;
  }

  /**
   * @returns {boolean}
   */
  get loaded () {
    return this.loaded_;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * Loads the json file via pattern `baseUrl/locale/id.json`
   *
   * @returns {Promise<void>}
   */
  async load () {
    if (this.loaded_)
      return;

    const result = await this.loadJson_();
    this.data_ = objectToMap(result.response);
    this.loaded_ = true;
  }

  /**
   * Checks if the bundle contains a localization key.
   *
   * @param {string} key
   * @returns {boolean}
   */
  contains (key) {
    if (this.data_ == null)
      throw new Error(
        `ResourceBundle '${this.id_}' with locale '${this.locale_} has not yet been loaded.`
      );

    return this.data_.has(key);
  }

  /**
   * @param {string} key
   * @returns {*}
   * @private
   */
  getValue_ (key) {
    if (!this.contains(key))
      throw new Error(
        `Provided key '${key}' could not be found in ResourceBundle '${this.id_}' with locale '${this.locale_}'.`
      );

    return this.data_.get(key);
  }

  /**
   * Gets an object from the json localization file.
   *
   * @param {string} key
   * @returns {Object}
   */
  getObject (key) {
    return /** @type {Object} */ (this.getValue_(key));
  }

  /**
   * Gets an array from the json localization file.
   *
   * @param {string} key
   * @returns {Array}
   */
  getArray (key) {
    return /** @type {Array} */ (this.getValue_(key));
  }

  /**
   * Gets a boolean from the json localization file.
   *
   * @param {string} key
   * @returns {boolean}
   */
  getBoolean (key) {
    return /** @type {boolean} */ (this.getValue_(key));
  }

  /**
   * Gets a number from the json localization file.
   *
   * @param {string} key
   * @returns {number}
   */
  getNumber (key) {
    return /** @type {number} */ (this.getValue_(key));
  }

  /**
   * Gets a string from the json localization file.
   *
   * Takes an optional `replaceObject` which will replace placeholder keys in the string.
   * An object with key `foo` will replace all placeholders `{foo}`.
   *
   * @param {string} key
   * @param {Object=} replaceObject
   * @returns {string}
   */
  getString (key, replaceObject = null) {
    let str = /** @type {string} */ (this.getValue_(key));

    if (replaceObject != null) {
      for (const [key, value] of Object.entries(replaceObject)) {
        str = str.replace(new RegExp(`{${key}}`, 'g'), value);
      }
    }

    return str;
  }
}

exports = ResourceBundle;
