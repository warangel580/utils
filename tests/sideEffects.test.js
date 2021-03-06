const { tap, using, copy, clone, tryCatch, parseJson, toJson, debug } = require('../src/utils')
const sinon = require("sinon");

describe("tap", () => {
  it('calls function with data as-is', () => {
    let fn = sinon.fake();

    tap({ foo: "bar" }, fn);

    expect(fn.calledWith({ foo: "bar" })).toBe(true);
  })

  it('returns data without side-effect result', () => {
    expect(tap([], data => data.push(1))).toStrictEqual([1]);
    expect(tap({}, data => data.a = 1  )).toStrictEqual({a: 1});
  })
});

describe("using", () => {
  it('can call a function using named args', () => {
    let fn = sinon.fake();

    using(1, 2, { foo: "bar" }, fn);

    expect(fn.calledWith(1, 2, { foo: "bar" })).toBe(true);
  })

  it('returns function result', () => {
    expect(using(1 + 2, 3, (a, b) => a + b)).toBe(6);
  })
});

describe("copy", () => {
  it("copies arrays", function () {
    let oldArray = [1, 2, 3];
    let newArray = copy(oldArray);

    newArray.push(4);

    expect(oldArray).toStrictEqual([1, 2, 3]);
    expect(newArray).toStrictEqual([1, 2, 3, 4]);
  });

  it("copies objects", function () {
    let oldObject = { a: 1, b: 2, c: 3 };
    let newObject = copy(oldObject);

    newObject['d'] = 4;

    expect(oldObject).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(newObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("can't copy nested objects (use clone instead !)", function () {
    let oldObject = { flag: "FR", country: { city: "Paris" } };
    let newObject = copy(oldObject);

    newObject.flag         = "CA";
    newObject.country.city = "Vancouver";

    expect(oldObject).toStrictEqual({ flag: "FR", country: { city: "Vancouver" /* (!) */ }});
    expect(newObject).toStrictEqual({ flag: "CA", country: { city: "Vancouver" }});
  });

  it("return plain values as-is", function () {
    let values = [42, "hello", null, undefined];

    values.forEach(value => {
      expect(copy(value)).toStrictEqual(value);
    });
  });
});

describe("clone", () => {
  it("clones arrays", function () {
    let oldArray = [1, 2, 3];
    let newArray = clone(oldArray);

    newArray.push(4);

    expect(oldArray).toStrictEqual([1, 2, 3]);
    expect(newArray).toStrictEqual([1, 2, 3, 4]);
  });

  it("clones objects", function () {
    let oldObject = { a: 1, b: 2, c: 3 };
    let newObject = clone(oldObject);

    newObject['d'] = 4;

    expect(oldObject).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(newObject).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("clones nested objects", function () {
    let oldObject = { flag: "FR", country: { city: "Paris" } };
    let newObject = clone(oldObject);

    newObject.flag = "CA";
    newObject.country.city = "Vancouver";

    expect(oldObject).toStrictEqual({ flag: "FR", country: { city: "Paris" } });
    expect(newObject).toStrictEqual({ flag: "CA", country: { city: "Vancouver" } });
  });

  it("return plain values as-is", function () {
    let values = [42, "hello", null, undefined];

    values.forEach(value => {
      expect(clone(value)).toStrictEqual(value);
    });
  });
});

describe("tryCatch", () => {
  it("uses try result when everything goes well", function () {
    expect(tryCatch(() => 42)).toStrictEqual(42);
  });

  it("uses catch value in case of errors", function () {
    let boom = () => { throw 'BOOM' };

    expect(tryCatch(boom)).toStrictEqual(undefined);
    expect(tryCatch(boom, 42)).toStrictEqual(42);
    expect(tryCatch(boom, err => err)).toStrictEqual("BOOM");
  });
});

describe("parseJson", () => {
  it("parses a valid json string", function () {
    expect(parseJson(JSON.stringify({ a: 1, b: 2 }))).toStrictEqual({ a: 1, b: 2 });
  });

  it("defaults to empty object if json is invalid", function () {
    expect(parseJson("{invalid}")).toStrictEqual({});
    expect(parseJson("[invalid]")).toStrictEqual({});
  });

  it("uses defaultValue if json is invalid", function () {
    expect(parseJson("{invalid}", 42)).toStrictEqual(42);
  });
});

describe("toJson", () => {
  it("parses a valid json string", function () {
    expect(toJson({ a: 1, b: 2 }))       .toStrictEqual('{"a":1,"b":2}');
    expect(toJson({ a: 1, b: 2 }, false)).toStrictEqual('{"a":1,"b":2}');
  });

  it("makes a valid json string pretty", function () {
    expect(toJson({ a: 1, b: 2 }, true)).toStrictEqual(JSON.stringify({ a: 1, b: 2 }, null, 2));
    expect(toJson({ a: 1, b: 2 }, 4))   .toStrictEqual(JSON.stringify({ a: 1, b: 2 }, null, 4));
  });

  it("defaults to empty object if json is invalid", function () {
    expect(parseJson(toJson(undefined))).toStrictEqual(undefined);
  });

  it("uses defaultValue if json is invalid", function () {
    expect(parseJson(toJson(null))).toStrictEqual(null);
  });
});

describe("debug", () => {
  it("returns data and prints it", function () {
    console.log = sinon.fake();

    expect(debug(42, "my", "value")).toStrictEqual(42);

    expect(console.log.calledWith("my", "value", 42)).toBe(true);
  });
});
