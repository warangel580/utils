const { reduce, transform, map, filter, each, eachSync } = require("../src/utils");
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

describe('eachSync', function () {
  it('behaves like a synchronous Array.each on arrays', async function () {
    let calls = [];

    await eachSync([5, 10, 15], async (v, i) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, i]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([[5, 0], [10, 1], [15, 2]])
  });

  it('behaves like a synchronous Array.each on objects too', async function () {
    let calls = [];

    await eachSync({"5": "foo", "10": "bar", "15": "baz"}, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v,k,o]), 15 - k))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([
      ["foo", "5",  {"5": "foo", "10": "bar", "15": "baz"}],
      ["bar", "10", {"5": "foo", "10": "bar", "15": "baz"}],
      ["baz", "15", {"5": "foo", "10": "bar", "15": "baz"}]
    ]);
  });
});