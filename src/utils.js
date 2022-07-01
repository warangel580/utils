// Types

let isNil = (data) => {
  return data === undefined || data === null;
}

let isFunction = (data) => {
  return typeof data === "function";
}

let isArray = (data) => {
  return data instanceof Array;
}

let isObject = (data) => {
  return ! isNil(data) 
      && ! isArray(data)
      && ! isFunction(data)
      && typeof data === "object"
}

let isIterable = (data) => {
  return isArray(data) || isObject(data);
}

// Iterators

let reduce = (data, fn, initialValue) => {
  if (isArray(data)) {
    return data.reduce(fn, initialValue)
  }

  let result = initialValue;
  for (let key in data) {
    result = fn(result, data[key], key, data);
  }
  return result;
}

let transform = (initialValue, data, fn) => {
  return reduce(data, fn, initialValue);
}

let map = (data, fn) => {
  if (isArray(data)) {
    return data.map(fn);
  }

  if (isObject(data)) {
    return transform({}, data, (object, value, key) => {
      // @NOTE: this can be unsafe because we create a new object
      return setUnsafe(object, key, fn(value, key, data));
    });
  }
  
  return data;
}

let filter = (data, fn) => {
  if (isArray(data)) {
    return data.filter(fn);
  }
  
  if (isIterable(data)) {
    return transform({}, data, (object, value, key) => {
      return fn(value, key, data)
        // @NOTE: this can be unsafe because we create a new object
        ? setUnsafe(object, key, value)
        : object;
    });
  }

  return data;
}

let each = function (data, fn) {
  return reduce(data, (_, value, key) => {
    fn(value, key, data);
  });
}

// Side-effects

let copy = (data) => {
  if (isArray (data)) return data.slice(0);
  if (isObject(data)) return Object.assign({}, data);
  return data;
}

let tryCatch = (tryFn, catchFn) => {
  try {
    return tryFn();
  } catch (err) {
    return isFunction(catchFn)
      ? catchFn(err)
      : catchFn;
  }
}

let parseJson = (raw, defaultValue = {}) => {
  return ! isNil(raw)
    ? tryCatch(() => JSON.parse(raw), defaultValue)
    : raw;
}

let toJson = (data) => {
  return JSON.stringify(data);
}

let clone = (data) => {
  return parseJson(toJson(data))
}

let tap = (data, fn) => {
  fn(data); return data;
}

let debug = (data, ...args) => {
  return tap(data, data => console.log(...args, data))
}

// Getters / Setters

let _normalizePath = (path) => {
  if (path === "") return [];

  return map(isArray(path) ? path : [ path ], part => {
    if (part === null)      return "null";
    if (part === undefined) return "undefined";
    return part;
  });
}

let get = (data, path, notFoundValue) => {
  if (isNil(data)) return notFoundValue;

  path = _normalizePath(path);

  if (path.length === 0) {
    return data;
  }

  let [head, ...tail] = path;

  return get(data[head], tail, notFoundValue);
}


let _set = (options = {}) => {
  let safe = get(options, 'safe', true)

  return (data, path, newValue) => {
    if (safe) data = copy(data);

    return using(data, _normalizePath(path), (data, path) => {
      if (path.length === 0) {
        return isFunction(newValue) ? newValue(data) : newValue;
      }

      // @NOTE: using `data || {}` instead of `or(data, {})` for performance reasons on large datasets
      return tap(data || {}, data => {
        return using(path, ([head, ...tail]) => {
          data[head] = _set(options)(data[head], tail, newValue);
        });
      });
    })
  }
}

let set       = _set({ safe: true  });
let setUnsafe = _set({ safe: false });

// Data helpers

let keys = (data) => {
  return transform([], data, (keys, _, key) => {
    return pushLast(keys, key);
  });
}

let values = (data) => {
  return transform([], data, (keys, value) => {
    return pushLast(keys, value);
  });
}

let size = (data) => {
  return isIterable(data)
    ? get(keys(data), 'length')
    : undefined;
}

let entries = (data) => {
  return transform([], data, (entries, value, key) => {
    return pushLast(entries, [key, value]);
  });
}

let sort = (data, fn) => {
  if (isArray(data)) {
    return tap(copy(data), data => data.sort(fn));
  }

  return transform({}, tap(
    entries(data),
    entries => entries.sort(([k1, v1], [k2, v2]) => {
      return fn(v1, v2, k1, k2)
    })
  ), (data, [key, value]) => {
    // @NOTE: this can be unsafe because we create a new object
    return setUnsafe(data, key, value);
  });
}

let randomEntryIn = (data) => {
  let n = size(data);

  if (! n) return undefined;

  return get(
    entries(data),
    Math.floor(Math.random() * n)
    // TODO: lerp(Math.random(), 0, 1, 0, n)
  );
}

let randomIn = (data) => {
  return get(randomEntryIn(data), 1);
}

let randomKeyIn = (data) => {
  return get(randomEntryIn(data), 0);
}

// Array helpers

let _pushFirst = (options) => {
  let safe = get(options, 'safe', true);

  return (data, ...values) => {
    if (safe) data = copy(data)

    return tap(data || [], data => data.unshift(...values));
  }
}

let pushFirst       = _pushFirst({ safe: true  });
let pushFirstUnsafe = _pushFirst({ safe: false });


let _pushLast = (options) => {
  let safe = get(options, 'safe', true);

  return (data, ...values) => {
    if (safe) data = copy(data)

    return tap(data || [], data => data.push(...values));
  }
}

let pushLast       = _pushLast({ safe: true  })
let pushLastUnsafe = _pushLast({ safe: false })

let popFirst = (data) => {
  return using(data || [], ([first, ...rest]) => {
    return [first, rest];
  });
}

let popLast = (data) => {
  return using(data || [], (data) => {
    return using(data.slice(-1)[0], data.slice(0, -1), (last, rest) => {
      return [last, rest];
    });
  });
}

let concat = (...datas) => {
  return transform([], datas, (data, d) => {
    return data.concat(or(d, []));
  })
}

let _partition = (n, data) => {
  if (! size(data)) return [];

  return concat(
    [data.slice(0, n)],
    _partition(n, data.slice(n))
  );
}

let partition = (data, n, ...datas) => {
  return _partition(n, concat(data, ...datas));
}

let toPairs = (...datas) => {
  return _partition(2, concat(...datas));
}

// Object helpers

let merge = (...datas) => {
  let [fn, objects] = popLast(datas);

  if (isFunction(fn)) {
    let [object, otherObjects] = popFirst(objects);

    return transform(or(object, {}), otherObjects, fn);
  }

  return transform({}, datas, (current, next) => {
    return Object.assign(current, next);
  });
}

// Values helpers

let or = (...values) => {
  let rank = (value) => {
    if (value === undefined) return 0;
    if (value === null) return 1;
    if (value === false) return 2;
    // []
    if (isArray(value) && size(value) === 0) return 3;
    // {}
    if (isObject(value) && size(value) === 0) return 3;
    if (!value) return 4;
    if (value === true) return 5;
    if (value) return 6;
  };

  return sort(values, (v1, v2) => {
    return rank(v2) - rank(v1);
  })[0];
}

let range = (size) => {
  return [...Array(size).keys()];
}

let when = (...kvs) => {
  return transform(undefined, toPairs(kvs), (result, [condition, value]) => {
    if (result !== undefined) return result;

    return (isFunction(condition) ? condition() : condition)
      ? value
      : result;
  });
}

let match = (value, ...kvs) => {
  let matching = (pattern, key, value) => {
    if (value === undefined) return true;

    return isFunction(key)
      ? key(pattern)
      : toJson(key) === toJson(pattern);
  }

  let pairs = map(toPairs(kvs), ([k, v]) => {
    return [() => matching(value, k, v), v === undefined ? k : v];
  });

  return when(...transform([], pairs, (kvs, [key, value]) => {
    return pushLast(kvs, key, value);
  }))
}

// Functions

let using = (...values) => {
  let fn = values.pop(); return fn(...values)
}

let call = (data, fnName, ...args) => {
  return data[fnName](...args);
}

let defer = (fn, ...args) => {
  return (data) => fn(data, ...args);
}

let pipe = (data, fns) => {
  return transform(data, fns, (data, fn) => fn(data));
}

module.exports = {
  // Types
  isNil,
  isFunction,
  isArray,
  isObject,
  isIterable,

  // Iterators
  reduce,
  transform,
  map,
  filter,
  each,
  
  // Side-effects
  debug,
  tap,
  copy,
  clone,
  tryCatch,
  parseJson,
  toJson,
  
  // Getters - Setters
  get,
  set, setUnsafe,

  // Data helpers
  size,
  keys,
  values,
  entries,
  sort,
  randomIn,
  randomKeyIn,
  randomEntryIn,

  // Array helpers
  pushFirst, pushFirstUnsafe,
  pushLast, pushLastUnsafe,
  popFirst,
  popLast,
  concat,
  partition,
  toPairs,

  // Object helpers
  merge,
  
  // Values helper
  or,
  range,
  match,
  when,

  // Functions
  using,
  call,
  defer,
  pipe,
}