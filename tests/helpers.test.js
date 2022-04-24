const { merge, get, set } = require('../src/utils')

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
    let o1 = { "a": 1, "price": 1 };
    let o2 = { "b": 2, "price": 2 };
    let o3 = { "c": 3, "price": 3 };

    expect(merge(
      o1, o2, o3,
      (total, current) => {
        return set(
          merge(total, current), 
          'price',
          get(total, 'price') + get(current, 'price')
        )
      }
    )).toStrictEqual({ "a": 1, "b": 2, "c": 3, "price": 6 });

    expect(o1).toStrictEqual({ "a": 1, "price": 1 });
    expect(o2).toStrictEqual({ "b": 2, "price": 2 });
    expect(o3).toStrictEqual({ "c": 3, "price": 3 });
  });
});