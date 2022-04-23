const { reduce, transform, map, filter, each } = require("../src/utils");
const sinon = require("sinon");

describe("reduce", () => {
  it("behaves like Array.reduce on arrays", function () {
    expect(reduce([1, 2, 3], (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("behaves like Array.reduce on objects", function () {
    expect(reduce({ a: 1, b: 2, c: 3 }, (s, v) => s + v, 1))
      .toStrictEqual(7);
  });

  it("ignores nil data", function () {
    expect(reduce(null,      (s, v) => s + v, 1)).toStrictEqual(1);
    expect(reduce(undefined, (s, v) => s + v, 1)).toStrictEqual(1);
  });
});

describe("transform", () => {
  it("behaves like reduce but with data as first arg", function () {
    expect(transform(1, [1, 2, 3], (s, v) => s + v))
      .toStrictEqual(7);
    
    expect(transform(1, { a: 1, b: 2, c: 3 }, (s, v) => s + v))
      .toStrictEqual(7);
    
    expect(transform(1, null,      (s, v) => s + v)).toStrictEqual(1);
    expect(transform(1, undefined, (s, v) => s + v)).toStrictEqual(1);
  });
});

describe("map", () => {
  it("behaves like Array.map on arrays", function () {
    expect(map([1, 2, 3], v => v + 1))
      .toStrictEqual([2, 3, 4]);
  });

  it("behaves like Array.map on objects", function () {
    expect(map({ a: 1, b: 2, c: 3 }, v => v + 1))
      .toStrictEqual({ a: 2, b: 3, c: 4 });
  });

  it("ignores nil data", function () {
    expect(map(null,      v => v + 1)).toStrictEqual(null);
    expect(map(undefined, v => v + 1)).toStrictEqual(undefined);
  });
});

describe("filter", () => {
  it("behaves like Array.filter on arrays", function () {
    expect(filter([1, 2, 3], v => v >= 2))
      .toStrictEqual([2, 3]);
  });

  it("behaves like Array.filter on objects", function () {
    expect(filter({ a: 1, b: 2, c: 3 }, v => v >= 2))
      .toStrictEqual({ b: 2, c: 3 });
  });

  it("ignores nil data", function () {
    expect(filter(null,      v => v >= 2)).toStrictEqual(null);
    expect(filter(undefined, v => v >= 2)).toStrictEqual(undefined);
  });
});

describe("each", () => {
  it("behaves like Array.forEach on arrays", function () {
    let callback = sinon.fake();
    let array = ["a", "b"];

    each(array, callback);

    expect(callback.calledWith("a", 0, array)).toBe(true);
    expect(callback.calledWith("b", 1, array)).toBe(true);
  });

  it("behaves like Array.forEach on objects", function () {
    let callback = sinon.fake();
    let object = { a: 1, b: 2 };

    each(object, callback);

    expect(callback.calledWith(1, "a", object)).toBe(true);
    expect(callback.calledWith(2, "b", object)).toBe(true);
  });

  it("ignores nil data", function () {
    let callback = sinon.fake();

    each(null,      callback);
    each(undefined, callback);

    expect(callback.called).toBe(false);
  });
});