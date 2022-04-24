const { pushFirst, pushLast, popFirst, popLast, concat } = require('../src/utils')

describe("pushFirst", () => {
  it("adds a value at the end of an array", function () {
    let oldArray = ["a"];
    let newArray = pushFirst(oldArray, "b");

    expect(newArray).toStrictEqual(["b", "a"]);
    expect(oldArray).toStrictEqual(["a"]);
  });

  it("creates an array with nil values", function () {
    expect(pushFirst(null, "a")).toStrictEqual(["a"]);
    expect(pushFirst(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushFirst(["x"], "a", "b", "c")).toStrictEqual(["a", "b", "c", "x"]);
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
    expect(pushLast(null, "a")).toStrictEqual(["a"]);
    expect(pushLast(undefined, "a")).toStrictEqual(["a"]);
  });

  it("uses multiple arguments", function () {
    expect(pushLast(["x"], "a", "b", "c")).toStrictEqual(["x", "a", "b", "c"]);
  });
});

describe("popFirst", () => {
  it("gets head value + tail array", function () {
    let oldArray = ["a", "b", "c"];
    let [head, tail] = popFirst(oldArray);

    expect(head).toStrictEqual("a");
    expect(tail).toStrictEqual(["b", "c"]);
    expect(oldArray).toStrictEqual(["a", "b", "c"]);
  });

  it("returns empty data if array is empty or nil", function () {
    expect(popFirst([])).toStrictEqual([undefined, []]);
    expect(popFirst(null)).toStrictEqual([undefined, []]);
    expect(popFirst(undefined)).toStrictEqual([undefined, []]);
  });
});

describe("popLast", () => {
  it("gets tail value + body array", function () {
    let oldArray = ["a", "b", "c"];
    let [tail, body] = popLast(oldArray);

    expect(tail).toStrictEqual("c");
    expect(body).toStrictEqual(["a", "b"]);
    expect(oldArray).toStrictEqual(["a", "b", "c"]);
  });

  it("returns empty data if array is empty or nil", function () {
    expect(popLast([])).toStrictEqual([undefined, []]);
    expect(popLast(null)).toStrictEqual([undefined, []]);
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
    expect(concat(null, ["a"])).toStrictEqual(["a"]);
    expect(concat(undefined, ["a"])).toStrictEqual(["a"]);
  });

  it("doesn't fail with nil values in-between", function () {
    expect(concat(["a"], undefined, null, ["b"])).toStrictEqual(["a", "b"]);
  });
});