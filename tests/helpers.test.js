const { pushLast, concat, merge, sort, entries, keys, values, size, or, get, set } = require('../src/utils')

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

describe("pushLast", () => {
  it("adds a value at the end of an array", function () {
    let oldArray = ["a"];
    let newArray = pushLast(oldArray, "b");

    expect(newArray).toStrictEqual(["a", "b"]);
    expect(oldArray).toStrictEqual(["a"]);
  });

  it("creates an array with nil values", function () {
    expect(pushLast(null,      "a")).toStrictEqual(["a"]);
    expect(pushLast(undefined, "a")).toStrictEqual(["a"]);
  });
});

describe("concat", () => {
  it("merges arrays together", function () {
    let oldArray = ["a"];
    let newArray = concat(oldArray, ["b"]);

    expect(newArray).toStrictEqual(["a", "b"]);
    expect(oldArray).toStrictEqual(["a"]);
  });

  it("concats multiple arguments", function () {
    expect(concat(["a"], ["b"], ["c"])).toStrictEqual(["a", "b", "c"]);
  });

  it("creates an array with nil values", function () {
    expect(concat(null,      ["a"])).toStrictEqual(["a"]);
    expect(concat(undefined, ["a"])).toStrictEqual(["a"]);
  });

  it("doesn't fail with nil values in-between", function () {
    expect(concat(["a"], undefined, null, ["b"])).toStrictEqual(["a", "b"]);
  });
});

describe("merge", () => {
  it("merges objects together", function () {
    let oldObject = {"a": 1};
    let newObject = merge(oldObject, {"b": 2});

    expect(newObject).toStrictEqual({"a": 1, "b": 2});
    expect(oldObject).toStrictEqual({"a": 1});
  });

  it("merges multiple arguments", function () {
    expect(merge({"a": 1}, {"b": 2}, {"c": 3})).toStrictEqual({"a": 1, "b": 2, "c": 3});
  });

  it("creates an array with nil values", function () {
    expect(merge(null, {"a": 1})).toStrictEqual({"a": 1});
    expect(merge(undefined, {"a": 1})).toStrictEqual({"a": 1});
  });

  it("doesn't fail with nil values in-between", function () {
    expect(merge({"a": 1}, undefined, null, {"b": 2})).toStrictEqual({"a": 1, "b": 2});
  });

  it("merges object with callbacks", function () {
    expect(merge(
      { "price": 1 }, { "price": 2 }, { "price": 3 },
      (current, next) => {
        return set(current, 'price', price => or(price, 0) + get(next, 'price', 0))
      }
    )).toStrictEqual({ "price": 6 });
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


describe("or", () => {
  it("can be used as a default value enforcing", function () {
    expect(or([1, 2, 3], [])).toStrictEqual([1, 2, 3]);
    expect(or(undefined, [])).toStrictEqual([]);
  });

  it("returns the least falsy value", function () {
    expect(or(undefined))             .toStrictEqual(undefined);
    expect(or(undefined, null))       .toStrictEqual(null);
    expect(or(null, undefined))       .toStrictEqual(null);
    expect(or(undefined, null, false)).toStrictEqual(false);
    expect(or(false, null, undefined)).toStrictEqual(false);
    expect(or(false, [], {}))         .toStrictEqual([]);
    expect(or(false, {}, []))         .toStrictEqual({});
    expect(or(true,  {}, []))         .toStrictEqual(true);
    expect(or(true,  [], {}))         .toStrictEqual(true);
  });

  it("returns the first filled data", function () {
    expect(or([], [1]))   .toStrictEqual([1]);
    expect(or({}, {a: 1})).toStrictEqual({a: 1});
  });
});