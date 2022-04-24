const { keys, values, entries, size, sort } = require('../src/utils')

describe("keys", () => {
  it("returns array indexes", function () {
    expect(keys(['a', 'b'])).toStrictEqual([0, 1]);
  });

  it("returns object keys", function () {
    expect(keys({ a: 1, b: 2 })).toStrictEqual(['a', 'b']);
  });

  it("returns empty array for nil keys", function () {
    expect(keys(undefined)).toStrictEqual([]);
  });
});

describe("values", () => {
  it("returns array values as-is", function () {
    expect(values(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns object values", function () {
    expect(values({ a: 1, b: 2 })).toStrictEqual([1, 2]);
  });

  it("returns empty array for nil values", function () {
    expect(values(undefined)).toStrictEqual([]);
  });
});

describe("entries", () => {
  it("returns an empty array with empty data", function () {
    expect(entries({})).toStrictEqual([]);
    expect(entries([])).toStrictEqual([]);
  });

  it("returns entries", function () {
    expect(entries({ a: 1, b: { x: 2, y: [3, 4] }, c: ['foo', 'bar'] })).toStrictEqual([
      ['a', 1],
      ['b', { x: 2, y: [3, 4] }],
      ['c', ['foo', 'bar']],
    ]);

    expect(entries(['a', {x: 1, y: 2}, ["bar"]])).toStrictEqual([
      [0, 'a'],
      [1, {x: 1, y: 2}],
      [2, ['bar']],
    ]);
  });
});

describe("size", () => {
  it("returns array length", function () {
    expect(size(['a', 'b'])).toBe(2);
  });

  it("returns object length", function () {
    expect(size({ foo: 'bar', baz: 'bee' })).toBe(2);
  });

  it("returns 0 for empty iterables", function () {
    [[], {}].forEach(e => {
      expect(size(e)).toStrictEqual(0);
    })
  });

  it("returns undefined for simple data and nil", function () {
    [42, 3.14, "hello", undefined, null].forEach(e => {
      expect(size(e)).toStrictEqual(undefined);
    })
  });
});

describe("sort", () => {
  it("can sort arrays", function () {
    let oldArray = [3, 7, 5];
    let newArray = sort(oldArray, (v1, v2) => v2 - v1);

    expect(newArray).toStrictEqual([7, 5, 3]);
    expect(oldArray).toStrictEqual([3, 7, 5]);
  });

  it("can sort objects", function () {
    let oldObject = {a: 3, b: 7, c: 5};
    let newObject = sort(oldObject, (v1, v2) => v2 - v1);

    expect(entries(newObject)).toStrictEqual(entries({b: 7, c: 5, a: 3}));
    expect(entries(oldObject)).toStrictEqual(entries({a: 3, b: 7, c: 5}));
  });
});
