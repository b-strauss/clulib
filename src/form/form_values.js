goog.module('clulib.form.FormValues');

class FormValues {
  /**
   * @param {Map<string, string|Blob|Array<string|Blob>>=} map Creates the FormValues with preexisting values
   */
  constructor (map = null) {
    /**
     * @type {Map<string, string|Blob|Array<string|Blob>>}
     * @private
     */
    this.data_ = new Map(map);
  }

  /**
   * Appends a new value onto an existing key, or adds the key if it does not already exist.
   *
   * @param {string} key
   * @param {string|Blob} value
   */
  append (key, value) {
    const currentValue = this.data_.get(key);

    if (currentValue != null) {
      if (Array.isArray(currentValue))
        currentValue.push(value);
      else
        this.data_.set(key, [currentValue, value]);
    } else {
      this.set(key, value);
    }
  }

  /**
   * Deletes a key/value pair.
   *
   * @param {string} key
   */
  delete (key) {
    this.data_.delete(key);
  }

  /**
   * Returns the first value associated with a given key.
   *
   * @param {string} key
   * @returns {string|Blob}
   */
  get (key) {
    const value = this.data_.get(key);

    if (Array.isArray(value))
      return value[0];

    return value;
  }

  /**
   * Returns an array of all the values associated with a given key.
   *
   * @param {string} key
   * @returns {Array<string|Blob>}
   */
  getAll (key) {
    const value = this.data_.get(key);

    if (Array.isArray(value))
      return value;
    else
      return [value];
  }

  /**
   * Returns a boolean stating whether a certain key/value pair exists.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has (key) {
    return this.data_.has(key);
  }

  /**
   * Sets a new value for an existing key inside, or adds the key/value if it does not already exist.
   *
   * @param {string} key
   * @param {string|Blob} value
   */
  set (key, value) {
    this.data_.set(key, value);
  }

  /**
   * Clones the FormValues object.
   *
   * @returns {FormValues}
   */
  clone () {
    return new FormValues(this.data_);
  }

  /**
   * Creates a new Map from the FormValues object.
   *
   * @returns {Map<string, string|Blob|Array<string|Blob>>}
   */
  toMap () {
    return new Map(this.data_);
  }

  /**
   * Creates a new FormData object to be sent to the server.
   *
   * @returns {FormData}
   */
  toFormData () {
    const formData = new FormData();

    this.data_.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach(arrayValue => {
          formData.append(`${key}[]`, arrayValue);
        });
      } else {
        formData.append(key, /** @type {string|Blob} */ (value));
      }
    });

    return formData;
  }
}

exports = FormValues;
