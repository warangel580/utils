# Utils

## Common operations on the most used data structures : single values (strings, numbers, ...), arrays and objects.

Dealing with only "simple" types allows to model complex systems with only simple functions usable on everything.

As a design philosophy, all functions use "data" as a first argument and use no side-effects so they're easily reusable on iterable data.

## Installation

`npm install @warangel580/utils`

or

`yarn add @warangel580/utils`

## Import

```js
// ES6
import { transform, get, set } from "@warangel580/utils";
```
```js
// NodeJS
const { transform, get, set } = require("@warangel580/utils");
```

# API

Note: `_` means "any other parameter"

## Types

### `isNil(data)`

Return true if data is `null` or `undefined`

```js
isNil(undefined) // => true
isNil(null)      // => true
isNil(_)         // => false
```

### `isFunction(data)`

Return true if data is a function

```js
isFunction(() => {}) // => true
isFunction(_)        // => false
```

### `isArray(data)`

Return true if data is an array

```js
isArray([/* ... */]) // => true
isArray(_)           // => false
```

### `isObject(data)`

Return true if data is an array

```js
isObject({/* ... */}) // => true
isObject(_)           // => false
```

### `isIterable(data)`

Return true if data is iterable, i.e. is an array or an object

```js
isIterable([/* ... */]) // => true
isIterable({/* ... */}) // => true
isIterable(_)           // => false
```

## Iterators

### `reduce(data, fn, initialValue)`

Like `Array.reduce` but works on objects too.

Iterates on data by doing `next = fn(current, value, key, data)`, starting with `initialValue` as `current`.


If `data` is not iterable, it returns `initialValue`.

```js
const add = (a, b) => a + b;

reduce([1, 2, 3],          add, 0) // => 6
reduce({a: 1, b: 2, c: 3}, add, 0) // => 6
reduce(undefined,          add, 0) // => 0
```

### `transform(initialValue, data, fn)`

Like `reduce` but arguments are swapped for readability, for example when we're trying to "transform" an existing value instead of creating a new one.

```js
transform({a: 1}, [{b: 2}, {c: 3}], (current, next) => {
  return Object.assign(current, next);
}) // => {a: 1, b: 2, c: 3}
```

### `map(data, fn)`

Like `Array.map` but works on objects too.

Iterates on data by doing `value = fn(value, key, data)`

If `data` is not iterable, it returns `data`.

```js
const inc = x => x + 1;

map([1, 2, 3],          inc) // => [2, 3, 4]
map({a: 1, b: 2, c: 3}, inc) // => {a: 2, b: 3, c: 4}
map(null,               inc) // => null
```

### `filter(data, fn)`

Like `Array.filter` but works on objects too.

Iterates on data by doing `keep = fn(value, key, data)`

If `data` is not iterable, it returns `data`.

```js
const isEven = x => x % 2 == 0;

reduce([1, 2, 3],          isEven) // => [2]
reduce({a: 1, b: 2, c: 3}, isEven) // => {b: 2}
reduce(null,               isEven) // => null
```

### `each(data, fn)`

Like `Array.forEach` but works on objects too.

Iterates on data by doing `fn(value, key, data)`

If `data` is not iterable, it returns `data`.

```js
const log = v => console.log(v)

each([1, 2, 3],          log) // logs(1) then (2), (3)
each({a: 1, b: 2, c: 3}, log) // logs(1) then (2), (3)
each(null,               log) // (nothing happens)
```

## Side-effects

### `debug(data, ...rest)`

Returns data after `console.log(...rest, data)` so it's easy to add `debug()` to existing code

```js
// => console.log("a", a, "b", b, "=>", a + b)
// => return a + b
return debug(a + b, "a", a, "b", b, "=>");
```

### `tap(data)`

Returns data after applying side-effect to allow chaining

```js
// Adding a user in a single line
return tap(users, users => users.push(user));
```

### `copy(data)`

Returns a shallow-copy of data to ensure that it doesn't change later with side-effects.

```js
let prev = [1, 2, 3, 4];
let next = copy(prev);

// Editing number with side-effects
next.push(5);

// Previous hasn't changed
prev // => [1, 2, 3, 4]
```

### `clone(data)`

Same as copy, but returns a deep copy (slow!) of data.

### `parseJson(data, defaultValue = {})`

Parse json without failing.

```js
parseJson('{"foo":"bar"}')  // => {foo: "bar"}
parseJson('{invalid json}') // => {}
parseJson('{invalid json}', undefined) // => undefined
```

### `toJson(data)`

Transforms data into JSON representation

```js
toJson({foo: "bar"})  // => '{"foo":"bar"}'
```

### `tryCatch(fn, onCatch)`

Returns `fn` result or run/return `onCatch` if something goes wrong.

```js
let fail = () => { throw 'ERR' }

tryCatch(fail)             // => undefined
tryCatch(fail, 42)         // => 42
tryCatch(fail, err => err) // => 'ERR'
```

### Getters - Setters

### `get(data, path, notFoundValue = undefined)`

Get value from data.

```js
let userId   = get(response, ['user', userId, 'comments'], [])
// => <comments> or []
let userName = get(user, 'active', false);
// => <active> or false
```

### `set(data, path, newValue)`

Set a value (without side-effects) in a deep data tree of values.

```js
let user = {
  username: "warangel580",
  game: {
    score: 10,
  }
};

user = set(user, 'active', true);
user = set(user, ['game', 'state'], 'done');
user = set(user, ['game', 'score'], s => s * 2);

user /* => {
  username: "warangel580",
  active: true,
  game: {
    state: 'done',
    score: 20,
  }
} */
```

### Data

### `size(data)`

Get data size, like Array.length.

```js
size([1, 2, 3])                     // => 3
size({a: 1, b, 2, c: {x: 3, y: 4}}) // => 3
size(null)                          // => undefined
```

### keys(data)

Get data keys, like Object.keys().

```js
keys({a: 1, b, 2, c: {x: 3, y: 4}}) // ['a', 'b', 'c']
```

### values(data)

Get data values, like Object.values().

```js
values({a: 1, b, 2, c: {x: 3, y: 4}}) // => [1, 2, {x: 3, y: 4}]
```

### `entries(data)`

Get data  entries, like `Object.entries()`.

```js
let data = {a: 1, b: {x: 2, y: [3, 4]}, c: ['foo', 'bar']};

entries(data) // => [['a', 1], ['b', {x: 2, y: [3,4]}], ['c', ['foo', 'bar']]]
```

### `sort(data, comparator)`

Sort data (without side-effects), like `Array.sort()`.

Note that object order is "temporary" (not enforced by javascript) but still useful for displaying data.

```js
sort({a:1, b:7, c:4}, (v1, v2) => v2 - v1) // => {b:7, c:4, a:1}
```

### Arrays

TODO

pushFirst

pushLast

popFirst

popLast

concat

partition

toPairs


### Objects

merge


### Values

or

when

match


### Function

using

call

defer

pipe
