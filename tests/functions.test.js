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
      { name: "Jane", "age": 31, glasses: false },
      { name: "John", "age": 15, glasses: true  },
      { name: "Mary", "age": 26, glasses: true  },
      { name: "Fred", "age": 11, glasses: false },
      { name: "Paul", "age": 57, glasses: true  },
    ];

    expect(pipe(users, [
      _(filter, u => get(u, 'age', 0) >= 18),
      _(filter, _(get, 'glasses', false)),
      _(map,    _(get, "name"))
    ])).toStrictEqual([
      "Mary",
      "Paul"
    ]);
  });
});