'use strict';

const { hasOwnProperty: has } = Object.prototype;

function hasDeepProperty(obj, propertyPath) {
  if (!obj || !propertyPath) return false;

  const properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split('.');
  let o = obj;
  return !properties.some(propertyName => {
    if (!has.call(o, propertyName)) return true;
    ({ [propertyName]: o } = o);
    return false;
  });
}
exports.hasDeepProperty = hasDeepProperty;

/**
 * Returns deep chained object property, like 'prop1.prop2.prop3'
 *
 * @param {*} obj
 * @param {string | string[]} propertyPath
 */
function getDeepProperty(obj, propertyPath) {
  if (
    !obj ||
    typeof obj !== 'object' ||
    (typeof propertyPath !== 'string' && !Array.isArray(propertyPath))
  )
    return undefined;

  const [currentProperty, ...properties] = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split('.');
  const o = obj[currentProperty];
  if (!properties.length || !o) return o;
  // recursion
  return getDeepProperty(o, properties);
}
exports.getDeepProperty = getDeepProperty;

/* eslint-disable no-param-reassign */
/**
 * Sets deep object property(s)
 *
 * @param {*} obj
 * @param {Object | string} propertyPath - dot notated property or object { property: value }
 * @param {*} propertyValue
 */
function setDeepProperty(obj = {}, propertyPath, propertyValue) {
  if (!propertyPath) return obj;

  // Case of setDeepProperty(obj, { a: 1, 'b.c': 2 })
  if (typeof propertyPath !== 'string' && !Array.isArray(propertyPath)) {
    if (propertyValue)
      throw new TypeError(
        'If propertyPath is not a string then propertyValue must not be used!',
      );

    Object.entries(propertyPath).forEach(([key, value]) =>
      setDeepProperty(obj, key, value),
    );
    return obj;
  }

  // creating an object with given property
  const [firstProperty, ...properties] = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split('.');

  if (!properties.length) {
    obj[firstProperty] = propertyValue;
  } else {
    if (!has.call(obj, firstProperty)) obj[firstProperty] = {};
    setDeepProperty(obj[firstProperty], properties, propertyValue);
  }
  return obj;
}
/* eslint-enable no-param-reassign */
exports.setDeepProperty = setDeepProperty;
