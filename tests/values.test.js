const { or, when, match, size } = require('../src/utils')

describe("or", () => {
  it("can be used as a default value enforcing", function () {
    expect(or([1, 2, 3], [])).toStrictEqual([1, 2, 3]);
    expect(or(undefined, [])).toStrictEqual([]);
  });

  it("returns the least falsy value", function () {
    expect(or(undefined))             .toStrictEqual(undefined);
    expect(or(undefined, undefined))  .toStrictEqual(undefined);
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
    expect(or([], [1]))     .toStrictEqual([1]);
    expect(or({}, { a: 1 })).toStrictEqual({ a: 1 });
  });
});

describe("when", () => {
  it("defaults to undefined", function () {
    expect(when()).toStrictEqual(undefined);
  });

  it("uses the first true value", function () {
    expect(when(false, "a", true, "b", true, "c")).toStrictEqual("b");
  });

  it("uses truthy values too", function () {
    expect(when([], "a")).toStrictEqual("a");
  });

  it("can use callback to determine value", function () {
    expect(when(() => false, "a", () => true, "b")).toStrictEqual("b");
  });
});

describe("match", () => {
  it("matches value by using strict comparison", () => {
    expect(
      match(false,
        true,  "n",
        false, "y")
    ).toStrictEqual("y");
  });

  it("it has a default value", () => {
    expect(
      match(undefined,
        true,  "n",
        false, "y",
        "?")
    ).toStrictEqual("?");
  });

  it("matches value with callback", () => {
    expect(
      match(["a"], a => size(a) > 0, "y", "n")
    ).toStrictEqual("y");
  });

  it("matches empty values", () => {
    expect(
      match(undefined, undefined, "y", "n")
    ).toStrictEqual("y");

    expect(
      match(null, null, "y", "n")
    ).toStrictEqual("y");

    expect(
      match([], [], "y", "n")
    ).toStrictEqual("y");

    expect(
      match({}, {}, "y", "n")
    ).toStrictEqual("y");

    expect(
      match(42, 42, "y", "n")
    ).toStrictEqual("y");

    expect(
      match("str", "str", "y", "n")
    ).toStrictEqual("y");

    expect(
      match(["a"], ["a"], "y", "n")
    ).toStrictEqual("y");
  });

  /*
     let rank = (value) => {
      if (value === undefined) return 0;
      if (value === null)      return 1;
      if (value === false)     return 2;
      // []
      if (isArray (value) && size(value) === 0) return 3;
      // {}
      if (isObject(value) && size(value) === 0) return 3;
      if (! value)             return 4;
      if (value === true)      return 5;
      if (value)               return 6;
    };
    */
});