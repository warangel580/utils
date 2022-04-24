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
      return set(object, key, fn(value, key, data));
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
        ? set(object, key, value)
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

let set = (data, path, newValue) => {
  return using(copy(data), _normalizePath(path), (data, path) => {
    if (path.length === 0) {
      return isFunction(newValue) ? newValue(data) : newValue;
    }
  
    return tap(or(data, {}), data => {
      return using(path, ([head, ...tail]) => {
        data[head] = set(data[head], tail, newValue);
      });
    });
  });
}

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
    return set(data, key, value);
  });
}

// Array helpers

let pushFirst = (data, ...values) => {
  return tap(or(copy(data), []), data => data.unshift(...values));
}

let pushLast = (data, ...values) => {
  return tap(or(copy(data), []), data => data.push(...values));
}

let popFirst = (data) => {
  return using(or(data, []), ([first, ...rest]) => {
    return [first, rest];
  });
}

let popLast = (data) => {
  return using(or(copy(data), []), (data) => {
    let tail = data.pop();
    return [tail, data];
  });
}

let concat = (...datas) => {
  return transform([], datas, (data, d) => {
    return data.concat(or(d, []));
  })
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
    if (value === null)      return 1;
    if (value === false)     return 2;
    // []
    if (isArray (value) && size(value) === 0) return 3;
    // {}
    if (isObject(value) && size(value) === 0) return 3;
    if (! value)             return 4;
    if (value === true)      return 5;
    if (value)               return 6;
  };

  return sort(values, (v1, v2) => {
    return rank(v2) - rank(v1);
  })[0];
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
  set,

  // Data helpers
  size,
  keys,
  values,
  entries,
  sort,

  // Array helpers
  pushFirst,
  pushLast,
  popFirst,
  popLast,
  concat,

  // Object helpers
  merge,
  
  // Values helper
  or,

  // Functions
  using,
  call,
  defer,
  pipe,
}