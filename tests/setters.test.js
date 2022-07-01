const { set, setUnsafe, copy } = require('../src/utils')

// @NOTE: set & setUnsafe expectations are the same expect for side-effects

describe("set", () => {
  it("sets data in an empty object", function () {
    expect(set({}, ['a', 'b', 'c'], "d"))
      .toStrictEqual({ a: { b: { c: "d" } } });
  });

  it("sets data in an empty array", function () {
    expect(set([], 0, "a"))
      .toStrictEqual(["a"]);
  });

  it("sets data in an existing array", function () {
    expect(set(["a", "b", "c", "d"], [2], "x"))
      .toStrictEqual(["a", "b", "x", "d"]);

    expect(set(["a", "b", "c", "d"], '2', "x"))
      .toStrictEqual(["a", "b", "x", "d"]);

    expect(set(["a", "b", "c", "d"], 2, "x"))
      .toStrictEqual(["a", "b", "x", "d"]);
  });

  it("udpates data in an existing object", function () {
    expect(set({ a: { b: { c: "d" } } }, ['a', 'b', 'e'], "f"))
      .toStrictEqual({ a: { b: { c: "d", e: "f" } } });
  });

  it("doesn't edit objects by side-effect", function () {
    let oldObject = { a: 1, b: 2, c: 3 };
    let newObject = set(oldObject, 'd', 4);

    expect(oldObject).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(newObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("updates data with a callback that takes the current value", function () {
    expect(set({ count: 1 }, ['count'], c => c + 1))
      .toStrictEqual({ count: 2 });
  });

  it("uses 'empty' base values as an object", function () {
    expect(set(null,      ['foo'], "bar")).toStrictEqual({ foo: "bar" });
    expect(set(undefined, ['foo'], "bar")).toStrictEqual({ foo: "bar" });
  });
});

describe("setUnsafe", () => {
  it("sets data in an empty object", function () {
    expect(setUnsafe({}, ['a', 'b', 'c'], "d"))
      .toStrictEqual({ a: { b: { c: "d" } } });
  });

  it("sets data in an empty array", function () {
    expect(setUnsafe([], 0, "a"))
      .toStrictEqual(["a"]);
  });

  it("sets data in an existing array", function () {
    expect(setUnsafe(["a", "b", "c", "d"], [2], "x"))
      .toStrictEqual(["a", "b", "x", "d"]);

    expect(setUnsafe(["a", "b", "c", "d"], '2', "x"))
      .toStrictEqual(["a", "b", "x", "d"]);

    expect(setUnsafe(["a", "b", "c", "d"], 2, "x"))
      .toStrictEqual(["a", "b", "x", "d"]);
  });

  it("udpates data in an existing object", function () {
    expect(setUnsafe({ a: { b: { c: "d" } } }, ['a', 'b', 'e'], "f"))
      .toStrictEqual({ a: { b: { c: "d", e: "f" } } });
  });

  it("edits objects by side-effects !", function () {
    let oldObject = { a: 1, b: 2, c: 3 };
    let newObject = setUnsafe(oldObject, 'd', 4);

    expect(oldObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 }); // <= be careful !
    expect(newObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("doesn't edit objects with side-effects if you copy them before", function () {
    let oldObject = { a: 1, b: 2, c: 3 };
    let newObject = setUnsafe(copy(oldObject), 'd', 4);

    expect(oldObject).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(newObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("updates data with a callback that takes the current value", function () {
    expect(setUnsafe({ count: 1 }, ['count'], c => c + 1))
      .toStrictEqual({ count: 2 });
  });

  it("uses 'empty' base values as an object", function () {
    expect(setUnsafe(null, ['foo'], "bar")).toStrictEqual({ foo: "bar" });
    expect(setUnsafe(undefined, ['foo'], "bar")).toStrictEqual({ foo: "bar" });
  });
});
