const { keys, values, entries, size, sort, randomIn, randomEntryIn, randomKeyIn } = require('../src/utils')

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

describe("randomIn", () => {
  it("gets a random value in data", function () {
    let array  = [1, 2, 3];
    let object = {a: 1, b: 2, c: 3};

    expect(array.includes(randomIn(array))) .toStrictEqual(true)
    expect(array.includes(randomIn(object))).toStrictEqual(true)
  });

  it("returns undefined if data is not iterable or empty", function () {
    expect(randomIn([]))       .toStrictEqual(undefined);
    expect(randomIn(42))       .toStrictEqual(undefined);
    expect(randomIn("string")) .toStrictEqual(undefined);
    expect(randomIn(null))     .toStrictEqual(undefined);
    expect(randomIn(undefined)).toStrictEqual(undefined);
  });
});

describe("randomEntryIn", () => {
  it("gets a random entry in data", function () {
    let array =  [1, 2, 3];
    let object = {a: 1, b: 2, c: 3};

    let arrayEntry = randomEntryIn(array);
    expect(array[arrayEntry[0]]).toStrictEqual(arrayEntry[1])

    let objectEntry = randomEntryIn(object);
    expect(object[objectEntry[0]]).toStrictEqual(objectEntry[1])
  });

  it("returns undefined if data is not iterable or empty", function () {
    expect(randomEntryIn([])).toStrictEqual(undefined);
    expect(randomEntryIn(42)).toStrictEqual(undefined);
    expect(randomEntryIn("string")).toStrictEqual(undefined);
    expect(randomEntryIn(null)).toStrictEqual(undefined);
    expect(randomEntryIn(undefined)).toStrictEqual(undefined);
  });
});

describe("randomKeyIn", () => {
  it("gets a random key in data", function () {
    let array = [1, 2, 3];
    let object = { a: 1, b: 2, c: 3 };

    let arrayKey = randomKeyIn(array);
    expect([0, 1, 2].includes(arrayKey))       .toStrictEqual(true)
    expect([1, 2, 3].includes(array[arrayKey])).toStrictEqual(true)

    let objectKey = randomKeyIn(object);
    expect(['a', 'b', 'c'].includes(objectKey))        .toStrictEqual(true)
    expect([1, 2, 3]      .includes(object[objectKey])).toStrictEqual(true)
  });

  it("returns undefined if data is not iterable or empty", function () {
    expect(randomKeyIn([])).toStrictEqual(undefined);
    expect(randomKeyIn(42)).toStrictEqual(undefined);
    expect(randomKeyIn("string")).toStrictEqual(undefined);
    expect(randomKeyIn(null)).toStrictEqual(undefined);
    expect(randomKeyIn(undefined)).toStrictEqual(undefined);
  });
});
