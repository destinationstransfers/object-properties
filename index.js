'use strict';

const hasOwn = Function.bind.call(
  Function.call,
  Object.prototype.hasOwnProperty,
);

function hasDeepProperty(obj, propertyPath) {
  if (!obj || !propertyPath) return false;

  const properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split('.');
  let o = obj;
  return !properties.some(propertyName => {
    if (!hasOwn(o, propertyName)) return true;
    ({ [propertyName]: o } = o);
    return false;
  });
}
module.exports.hasDeepProperty = hasDeepProperty;

/**
 * Returns deep chained object property, like 'prop1.prop2.prop3'
 *
 * @param {object} obj
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
module.exports.getDeepProperty = getDeepProperty;

/**
 * Sets deep object property(s)
 *
 * @param {object} obj
 * @param {object|string|string[]} propertyPath - dot notated property or object { property: value }
 * @param {*} propertyValue
 * @returns {object}
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
    if (!hasOwn(obj, firstProperty)) obj[firstProperty] = {};
    setDeepProperty(obj[firstProperty], properties, propertyValue);
  }
  return obj;
}
module.exports.setDeepProperty = setDeepProperty;

/**
 * Mutates object in place by removing deepProperty and all adjoined empty parents
 *
 * @param {object} obj
 * @param {string} propertyPath - dot notated property 'a.b'
 * @param {string[]} [props] - properties as array (used for recursion)
 * @returns {object}
 */
function deleteDeepProperty(
  obj,
  propertyPath = '',
  props = propertyPath.split('.'),
) {
  if (typeof obj !== 'object' || Object.keys(obj).length < 1) return {};
  if (props.length < 1) return obj;
  if (props.length === 1) {
    delete obj[props[0]];
  } else {
    // we have deep property
    if (hasOwn(obj, props[0])) {
      const o = obj[props[0]];
      deleteDeepProperty(o, '', props.slice(1));
      // clean empty object
      if (Object.keys(o).length === 0) delete obj[props[0]];
    }
  }
  return obj;
}
module.exports.deleteDeepProperty = deleteDeepProperty;
