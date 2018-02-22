goog.module('clulib.form.FormValues');

class FormValues {
  constructor () {
    /**
     * @type {Map<string, string|Blob|Array<string|Blob>>}
     * @package
     */
    this.data = new Map();
  }

  /**
   * Appends a new value onto an existing key, or adds the key if it does not already exist.
   *
   * @param {string} name
   * @param {string|Blob} value
   */
  append (name, value) {
    const currentValue = this.data.get(name);

    if (currentValue != null) {
      if (Array.isArray(currentValue))
        currentValue.push(value);
      else
        this.data.set(name, [currentValue, value]);
    } else {
      this.set(name, value);
    }
  }

  /**
   * Deletes a key/value pair.
   *
   * @param {string} name
   */
  delete (name) {
    this.data.delete(name);
  }

  /**
   * Returns the first value associated with a given key.
   *
   * @param {string} name
   * @returns {string|Blob}
   */
  get (name) {
    const value = this.data.get(name);

    if (Array.isArray(value))
      return value[0];

    return value;
  }

  /**
   * Returns an array of all the values associated with a given key.
   *
   * @param {string} name
   * @returns {Array<string|Blob>}
   */
  getAll (name) {
    const value = this.data.get(name);

    if (Array.isArray(value))
      return value;
    else
      return [value];
  }

  /**
   * Returns a boolean stating whether a certain key/value pair exists.
   *
   * @param {string} name
   * @returns {boolean}
   */
  has (name) {
    return this.data.has(name);
  }

  /**
   * Sets a new value for an existing key inside, or adds the key/value if it does not already exist.
   *
   * @param {string} name
   * @param {string|Blob} value
   */
  set (name, value) {
    this.data.set(name, value);
  }

  /**
   * Clones the FormValues object.
   *
   * @returns {FormValues}
   */
  clone () {
    return FormValues.fromMap(this.data);
  }

  /**
   * Creates a new Map from the FormValues object.
   *
   * @returns {Map<string, string|Blob|Array<string|Blob>>}
   */
  toMap () {
    return new Map(this.data);
  }

  /**
   * Creates a new FormData object to be sent to the server.
   *
   * @returns {FormData}
   */
  toFormData () {
    const formData = new FormData();

    this.data.forEach((value, key) => {
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

  /**
   * Creates a new FormValues object from an existing Map.
   *
   * @param {Map<string, string|Blob|Array<string|Blob>>} data
   * @returns {FormValues}
   */
  static fromMap (data) {
    const formValues = new FormValues();
    formValues.data = new Map(data);

    return formValues;
  }
}

exports = FormValues;
