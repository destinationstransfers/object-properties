'use strict';

const { hasDeepProperty, getDeepProperty, setDeepProperty } = require('./');

const testObject = {
  get funProperty() {
    return {
      foo: {
        bar: 'bar',
      },
    };
  },
  simpleProperty: {
    foo: {
      bar: {
        end: 'lastPropertyHere',
      },
    },
  },
};

describe('objectProperties helper', () => {
  test('find deep property at func property', () => {
    expect(hasDeepProperty(testObject, 'funProperty.foo.bar')).toBeTruthy();
    expect(
      hasDeepProperty(testObject, ['funProperty', 'foo', 'bar']),
    ).toBeTruthy();
    expect(
      hasDeepProperty(Object.freeze(testObject), 'simpleProperty.foo.bar.end'),
    ).toBeTruthy();
    expect(
      hasDeepProperty(testObject, 'simpleProperty.foo.bar.lost'),
    ).toBeFalsy();
  });

  test('must return false for non-existent properties', () => {
    expect(hasDeepProperty(testObject, 'funProperty.foo.tada')).toBeFalsy();
  });

  test('must return false for null and undefined objects', () => {
    expect(hasDeepProperty(null, 'funProperty')).toBeFalsy();
    expect(hasDeepProperty(undefined, 'funProperty')).toBeFalsy();
  });

  test('must work either with top level properties', () => {
    expect(hasDeepProperty(testObject, 'wrongprop')).toBeFalsy();
    expect(hasDeepProperty(testObject, 'simpleProperty')).toBeTruthy();
  });

  test('getDeepProperty', () => {
    expect(
      getDeepProperty(Object.freeze(testObject), 'simpleProperty.foo.bar.end'),
    ).toBe('lastPropertyHere');
    expect(
      getDeepProperty(testObject, 'simpleProperty.foo.bar.lost'),
    ).toBeUndefined();
    expect(getDeepProperty(1, 'a.b')).toBeUndefined();
  });

  test('getDeepProperty with path as frozen array', () => {
    expect(
      getDeepProperty(
        Object.freeze(testObject),
        Object.freeze(['simpleProperty', 'foo', 'bar']),
      ),
    ).toEqual({ end: 'lastPropertyHere' });
  });

  test('setDeepProperty', () => {
    const res = { propA: false, propB: { propE: 'keepIt' } };
    setDeepProperty(res, 'propB.propC.propD', 'XXX');
    expect(res).toEqual(
      expect.objectContaining({
        propA: expect.any(Boolean),
        propB: expect.objectContaining({
          propE: expect.stringMatching(/^ke{2}pIt$/),
          propC: expect.objectContaining({
            propD: expect.stringMatching(/^X{3}$/),
          }),
        }),
      }),
    );
  });

  test('setDeepProperty with object', () => {
    const res = { propA: false, propB: { propE: 'keepIt' } };
    setDeepProperty(res, {
      'propB.propC.propD': 'XXX',
      'propD.propE.propF': 'YYY',
    });
    expect(res).toEqual(
      expect.objectContaining({
        propA: expect.any(Boolean),
        propB: expect.objectContaining({
          propE: expect.stringMatching(/^ke{2}pIt$/),
          propC: expect.objectContaining({
            propD: expect.stringMatching(/^X{3}$/),
          }),
        }),
        propD: expect.objectContaining({
          propE: expect.objectContaining({
            propF: 'YYY',
          }),
        }),
      }),
    );
  });

  test('setDeepProperty with incompatible set of arguments must throw', () => {
    expect(() =>
      setDeepProperty(
        undefined,
        { a: 1, 'b.c': 2 },
        'and some wrong value here',
      ),
    ).toThrowError();
  });

  test('setDeepPropety returns original object', () => {
    const obj = { a: 1, b: 2 };
    expect(setDeepProperty(obj, '', 'wrongValue')).toEqual({ a: 1, b: 2 });
  });
});
