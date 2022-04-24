const { or } = require('../src/utils')

describe("or", () => {
  it("can be used as a default value enforcing", function () {
    expect(or([1, 2, 3], [])).toStrictEqual([1, 2, 3]);
    expect(or(undefined, [])).toStrictEqual([]);
  });

  it("returns the least falsy value", function () {
    expect(or(undefined)).toStrictEqual(undefined);
    expect(or(undefined, null)).toStrictEqual(null);
    expect(or(null, undefined)).toStrictEqual(null);
    expect(or(undefined, null, false)).toStrictEqual(false);
    expect(or(false, null, undefined)).toStrictEqual(false);
    expect(or(false, [], {})).toStrictEqual([]);
    expect(or(false, {}, [])).toStrictEqual({});
    expect(or(true, {}, [])).toStrictEqual(true);
    expect(or(true, [], {})).toStrictEqual(true);
  });

  it("returns the first filled data", function () {
    expect(or([], [1])).toStrictEqual([1]);
    expect(or({}, { a: 1 })).toStrictEqual({ a: 1 });
  });
});