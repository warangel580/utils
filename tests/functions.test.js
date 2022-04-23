const { map, filter, get, defer:_, pipe } = require('../src/utils');
const sinon = require("sinon");

describe("defer", () => {
  it("creates a partial function that can be called with data", function () {
    let callback = sinon.fake();
    let fn = _(callback, "arg1", "arg2", "arg3")
    fn("arg0");

    expect(callback.calledWith("arg0", "arg1", "arg2", "arg3")).toBe(true);
  });

  it("can be used to make iterable functions", function () {
    let users = [
      {name: "Jane"},
      {name: "Mary"},
      {name: "John"},
      {name: "Fred"},
    ];

    // Equivalent to map(users, user => get(user, "name"))
    expect(map(users, _(get, "name"))).toStrictEqual([
      "Jane",
      "Mary",
      "John",
      "Fred",
    ]);
  });
});

describe("pipe", () => {
  it("transforms data using multiple functions", function () {
    let users = [
      { name: "Jane", "age": 31 },
      { name: "John", "age": 15 },
      { name: "Mary", "age": 26 },
      { name: "Fred", "age": 11 },
    ];

    let isMajor = _(pipe, [
      _(get, 'age', 0),
      _((x, y) => x >= y, 18),
    ]);

    expect(pipe(users, [
      _(filter, isMajor),
      _(map,    _(get, "name"))
    ])).toStrictEqual([
      "Jane",
      "Mary",
    ]);
  });
});