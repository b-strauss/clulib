goog.module('clulib.l10n.ResourceManager');

const ResourceBundle = goog.require('clulib.l10n.ResourceBundle');

/**
 * Manages multiple ResourceBundles for multiple locales.
 *
 * Loads json localization files via pattern `baseUrl/locale/id.json`.
 */
class ResourceManager {
  /**
   * @param {Array<string>} bundleIds
   * @param {Array<string>} locales
   * @param {string} baseUrl
   */
  constructor (bundleIds, locales, baseUrl) {
    /**
     * @type {Array<string>}
     * @private
     */
    this.bundleIds_ = bundleIds;

    /**
     * @type {Array<string>}
     * @private
     */
    this.locales_ = locales;

    /**
     * @type {string}
     * @private
     */
    this.baseUrl_ = baseUrl;

    /**
     * @type {?string}
     * @private
     */
    this.currentLocale_ = null;

    /**
     * @type {Map<string, Map<string, ResourceBundle>>}
     * @private
     */
    this.bundles_ = new Map();

    locales.forEach(locale => {
      const localeMap = new Map();

      bundleIds.forEach(bundleId => {
        localeMap.set(bundleId, new ResourceBundle(bundleId, locale, baseUrl));
      });

      this.bundles_.set(locale, localeMap);
    });
  }

  /**
   * @returns {?string}
   */
  get currentLocale () {
    return this.currentLocale_;
  }

  /**
   * Checks if the locale is valid for this ResourceManager
   *
   * @param {string} locale
   * @returns {boolean}
   */
  isLocaleValid (locale) {
    return this.locales_.includes(locale);
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * Changes the current locale, loads the resource files if necessary.
   *
   * @param {string} locale
   * @returns {Promise<void>}
   */
  async changeLocale (locale) {
    if (!this.isLocaleValid(locale))
      throw new Error(`Locale '${locale}' is not registered with this ResourceManager.`);

    const bundleLoaders = Array.from(this.bundles_.get(locale).values())
      .map(bundle => bundle.load());

    await Promise.all(bundleLoaders);

    this.currentLocale_ = locale;
  }

  /**
   * Gets a specific bundle for the current locale.
   *
   * @param {string} bundleId
   * @returns {ResourceBundle}
   */
  getBundle (bundleId) {
    if (this.currentLocale_ == null)
      throw new Error('No locale set!');

    return this.bundles_.get(/** @type {!string} */ (this.currentLocale_)).get(bundleId);
  }

  /**
   * Checks if a bundle contains a localization key.
   *
   * @param {string} bundleId
   * @param {string} key
   * @returns {boolean}
   */
  contains (bundleId, key) {
    return this.getBundle(bundleId).contains(key);
  }

  /**
   * Gets an object from the json localization file of the current bundle.
   *
   * @param {string} bundleId
   * @param {string} key
   * @returns {Object}
   */
  getObject (bundleId, key) {
    return this.getBundle(bundleId).getObject(key);
  }

  /**
   * Gets an array from the json localization file of the current bundle.
   *
   * @param {string} bundleId
   * @param {string} key
   * @returns {Array}
   */
  getArray (bundleId, key) {
    return this.getBundle(bundleId).getArray(key);
  }

  /**
   * Gets a boolean from the json localization file of the current bundle.
   *
   * @param {string} bundleId
   * @param {string} key
   * @returns {boolean}
   */
  getBoolean (bundleId, key) {
    return this.getBundle(bundleId).getBoolean(key);
  }

  /**
   * Gets a number from the json localization file of the current bundle.
   *
   * @param {string} bundleId
   * @param {string} key
   * @returns {number}
   */
  getNumber (bundleId, key) {
    return this.getBundle(bundleId).getNumber(key);
  }

  /**
   * Gets a string from the json localization file of the current bundle.
   *
   * Takes an optional `replaceObject` which will replace placeholder keys in the string.
   * An object with key `foo` will replace all placeholders `{foo}`.
   *
   * @param {string} bundleId
   * @param {string} key
   * @param {Object=} replaceObject
   * @returns {string}
   */
  getString (bundleId, key, replaceObject = null) {
    return this.getBundle(bundleId).getString(key, replaceObject);
  }
}

exports = ResourceManager;
