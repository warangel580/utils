const { pushFirst, pushFirstUnsafe, pushLast, pushLastUnsafe, popFirst, popLast, concat, partition, toPairs } = require('../src/utils')

describe("pushFirst", () => {
  it("adds a value at the end of an array", function () {
    let oldArray = ["a"];
    let newArray = pushFirst(oldArray, "b");

    expect(newArray).toStrictEqual(["b", "a"]);
    expect(oldArray).toStrictEqual(["a"]);
  });

  it("creates an array with nil values", function () {
    expect(pushFirst(null, "a"))     .toStrictEqual(["a"]);
    expect(pushFirst(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushFirst(["x"], "a", "b", "c")).toStrictEqual(["a", "b", "c", "x"]);
  });
});

describe("pushFirstUnsafe", () => {
  it("adds a value at the end of an array", function () {
    let oldArray = ["a"];
    let newArray = pushFirstUnsafe(oldArray, "b");

    expect(newArray).toStrictEqual(["b", "a"]);
    expect(oldArray).toStrictEqual(["b", "a"]); // <= be careful !
  });

  it("creates an array with nil values", function () {
    expect(pushFirstUnsafe(null, "a")).toStrictEqual(["a"]);
    expect(pushFirstUnsafe(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushFirstUnsafe(["x"], "a", "b", "c")).toStrictEqual(["a", "b", "c", "x"]);
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
    expect(pushLast(null, "a"))     .toStrictEqual(["a"]);
    expect(pushLast(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushLast(["x"], "a", "b", "c")).toStrictEqual(["x", "a", "b", "c"]);
  });
});

describe("pushLastUnsafe", () => {
  it("adds a value at the end of an array", function () {
    let oldArray = ["a"];
    let newArray = pushLastUnsafe(oldArray, "b");

    expect(newArray).toStrictEqual(["a", "b"]);
    expect(oldArray).toStrictEqual(["a", "b"]);
  });

  it("creates an array with nil values", function () {
    expect(pushLastUnsafe(null, "a")).toStrictEqual(["a"]);
    expect(pushLastUnsafe(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushLastUnsafe(["x"], "a", "b", "c")).toStrictEqual(["x", "a", "b", "c"]);
  });
});

describe("popFirst", () => {
  it("gets head value + tail array", function () {
    let oldArray = ["a", "b", "c"];
    let [head, tail] = popFirst(oldArray);

    expect(head)    .toStrictEqual("a");
    expect(tail)    .toStrictEqual(["b", "c"]);
    expect(oldArray).toStrictEqual(["a", "b", "c"]);
  });

  it("returns empty data if array is empty or nil", function () {
    expect(popFirst([]))       .toStrictEqual([undefined, []]);
    expect(popFirst(null))     .toStrictEqual([undefined, []]);
    expect(popFirst(undefined)).toStrictEqual([undefined, []]);
  });
});

describe("popLast", () => {
  it("gets tail value + body array", function () {
    let oldArray = ["a", "b", "c"];
    let [tail, body] = popLast(oldArray);

    expect(tail)    .toStrictEqual("c");
    expect(body)    .toStrictEqual(["a", "b"]);
    expect(oldArray).toStrictEqual(["a", "b", "c"]);
  });

  it("returns empty data if array is empty or nil", function () {
    expect(popLast([]))       .toStrictEqual([undefined, []]);
    expect(popLast(null))     .toStrictEqual([undefined, []]);
    expect(popLast(undefined)).toStrictEqual([undefined, []]);
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
    expect(concat(null, ["a"]))     .toStrictEqual(["a"]);
    expect(concat(undefined, ["a"])).toStrictEqual(["a"]);
  });

  it("doesn't fail with nil values in-between", function () {
    expect(concat(["a"], undefined, null, ["b"])).toStrictEqual(["a", "b"]);
  });
});

describe("partition", () => {
  it("splits an array using a size", function () {
    expect(partition([1, 2, 3, 4, 5, 6], 3, [7, 8], [9, 10]))
      .toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });
});

describe("toPairs", () => {
  it("transforms an array into key, value pairs", function () {
    expect(toPairs(undefined)).toStrictEqual([]);

    expect(toPairs([])).toStrictEqual([]);

    expect(toPairs(["k"])).toStrictEqual([["k"]]);

    expect(toPairs(["k1", "v1", "k2", "v2"]))
      .toStrictEqual([["k1", "v1"], ["k2", "v2"]]);
  });

  it("works with multiple arguments", function () {
    expect(toPairs(["k1", "v1", "k2", "v2"], ["k3", "v3"], ["k4", "v4"]))
      .toStrictEqual([["k1", "v1"], ["k2", "v2"], ["k3", "v3"], ["k4", "v4"]]);
  });
});