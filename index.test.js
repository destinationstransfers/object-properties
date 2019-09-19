'use strict';

const {
  hasDeepProperty,
  getDeepProperty,
  setDeepProperty,
  deleteDeepProperty,
} = require('./');

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
  it('find deep property at func property', () => {
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

  it('must return false for non-existent properties', () => {
    expect(hasDeepProperty(testObject, 'funProperty.foo.tada')).toBeFalsy();
  });

  it('must return false for null and undefined objects', () => {
    expect(hasDeepProperty(null, 'funProperty')).toBeFalsy();
    expect(hasDeepProperty(undefined, 'funProperty')).toBeFalsy();
  });

  it('must work either with top level properties', () => {
    expect(hasDeepProperty(testObject, 'wrongprop')).toBeFalsy();
    expect(hasDeepProperty(testObject, 'simpleProperty')).toBeTruthy();
  });

  it('getDeepProperty', () => {
    expect(
      getDeepProperty(Object.freeze(testObject), 'simpleProperty.foo.bar.end'),
    ).toBe('lastPropertyHere');
    expect(
      getDeepProperty(testObject, 'simpleProperty.foo.bar.lost'),
    ).toBeUndefined();
    expect(getDeepProperty(1, 'a.b')).toBeUndefined();
  });

  it('getDeepProperty with path as frozen array', () => {
    expect(
      getDeepProperty(
        Object.freeze(testObject),
        // @ts-ignore
        Object.freeze(['simpleProperty', 'foo', 'bar']),
      ),
    ).toEqual({ end: 'lastPropertyHere' });
  });

  it('setDeepProperty', () => {
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

  it('setDeepProperty with object', () => {
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

  it('setDeepProperty with incompatible set of arguments must throw', () => {
    expect(() =>
      setDeepProperty(
        undefined,
        { a: 1, 'b.c': 2 },
        'and some wrong value here',
      ),
    ).toThrow();
  });

  it('setDeepProperty returns original object', () => {
    const obj = { a: 1, b: 2 };
    expect(setDeepProperty(obj, '', 'wrongValue')).toEqual({ a: 1, b: 2 });
  });

  it('deleteDeepProperty deletes top level properties', () => {
    const obj = { a: 1, b: 2 };
    deleteDeepProperty(obj, 'b');
    expect(obj).toEqual({ a: 1 });
  });

  it('deleteDeepProperty deletes deep level properties', () => {
    const obj = { a: 1, b: { c: 3, e: 4 } };
    deleteDeepProperty(obj, 'b.c');
    expect(obj).toEqual({ a: 1, b: { e: 4 } });
  });

  it('deleteDeepProperty cleans up deep level properties', () => {
    const obj = { a: 1, b: { c: 3, e: 4 } };
    deleteDeepProperty(obj, 'b.c');
    deleteDeepProperty(obj, 'b.e');
    expect(obj).toEqual({ a: 1 });

    const obj2 = { a: { b: { c: { d: 'eee' } } } };
    deleteDeepProperty(obj2, 'a.b.c.d');
    expect(obj2).toEqual({});
  });
});
