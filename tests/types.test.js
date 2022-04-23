const { isNil, isArray, isObject, isIterable, isFunction } = require('../src/utils')

describe("types", () => {
  it('checks if data is nil', () => {
    let expectations = [
      [null,          true],
      [undefined,     true],
      [42,            false],
      ["a",           false],
      [[],            false],
      [{},            false],
      [[1, 2],        false],
      [{a: 1},        false],
      [() => [],      false],
    ];
  
    expectations.forEach(([value, expected]) => {
      expect(isNil(value)).toStrictEqual(expected);
    })
  })
  
  it('checks if data is an array', () => {
    let expectations = [
      [null,      false],
      [undefined, false],
      [42,        false],
      ["a",       false],
      [[],        true],
      [{},        false],
      [[1, 2],    true],
      [{a: 1},    false],
      [() => [],  false],
    ];
  
    expectations.forEach(([value, expected]) => {
      expect(isArray(value)).toStrictEqual(expected);
    })
  })

  it('checks if data is iterable', () => {
    let expectations = [
      [null,      false],
      [undefined, false],
      [42,        false],
      ["a",       false],
      [[],        true],
      [{},        true],
      [[1, 2],    true],
      [{ a: 1 },  true],
      [() => [],  false],
    ];

    expectations.forEach(([value, expected]) => {
      expect(isIterable(value)).toStrictEqual(expected);
    })
  })
  
  it('checks if data is an object', () => {
    let expectations = [
      [null,      false],
      [undefined, false],
      [42,        false],
      ["a",       false],
      [[],        false],
      [{},        true],
      [[1, 2],    false],
      [{a: 1},    true],
      [() => [],  false],
    ];
  
    expectations.forEach(([value, expected]) => {
      expect(isObject(value)).toStrictEqual(expected);
    })
  })
  
  it('checks if data is a function', () => {
    let expectations = [
      [null,      false],
      [undefined, false],
      [42,        false],
      ["a",       false],
      [[],        false],
      [{},        false],
      [[1, 2],    false],
      [{a: 1},    false],
      [() => [],  true],
    ];
  
    expectations.forEach(([value, expected]) => {
      expect(isFunction(value)).toStrictEqual(expected);
    })
  })
});