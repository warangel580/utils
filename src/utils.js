// TYPES

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

// ITERATORS

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

  if (isObject(data)) {
    return transform({}, data, (object, value, key) => {
      return fn(value, key, data)
        ? set(object, key, value)
        : object;
    });
  }

  return data;
}

let each = function (data, fn) {
  if (isArray(data)) {
    data.forEach(fn);
    return;
  }

  return reduce(data, (_, value, key) => {
    fn(value, key, data);
  });
}

// Side-effect

let copy = (data) => {
  if (isArray (data)) return data.slice(0);
  if (isObject(data)) return Object.assign({}, data);
  return data;
}

let parseJson = (raw, defaultValue = {}) => {
  if (isNil(raw)) return raw;

  try {
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
}

let toJson = (data) => {
  return JSON.stringify(data);
}

let clone = (data) => {
  return parseJson(toJson(data))
}

let tap = (data, fn) => {
  fn(data);

  return data;
}

let using = (...values) => {
  let fn = values.pop();

  return fn(...values)
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

// Values helpers

let or = (...values) => {
  let rank = (value) => {
    if (value === undefined) return 0;
    if (value === null)      return 1;
    if (value === false)     return 2;
    if (value === true)      return 3;
    if (value === [])        return 4;
    if (value === {})        return 5;
    if (! value)             return 6;
    if (value)               return 7;
  };

  return tap(
    values,
    values => values.sort((v1, v2) => {
      return rank(v2) - rank(v1);
    })
  )[0];
}

// Array helpers

let pushLast = (data, value) => {
  return tap(or(data, []), data => data.push(value));
}

// @TODO: merge for objects with Object.assign ?

let concat = (...datas) => {
  return transform([], datas, (data, d) => {
    return data.concat(or(d, []));
  })
}

let sort = (data, fn) => { 
  if (isArray(data)) {
    return tap(data, data => data.sort(fn));
  }

  return transform({}, tap(
    Object.entries(data),
    entries => entries.sort(([k1, v1], [k2, v2]) => {
      return fn(v1, v2, k1, k2)
    })
  ), (data, [key, value]) => {
    return set(data, key, value);
  });
}

// Functions

let defer = (fn, ...args) => {
  return (data) => fn(data, ...args);
}

let pipe = (data, fns) => {
  return transform(data, fns, (data, fn) => {
    return fn(data);
  });
}

module.exports = {
  isNil,
  isFunction,
  isArray,
  isObject,
  reduce,
  transform,
  map,
  filter,
  each,
  tap,
  copy,
  clone,
  parseJson,
  toJson,
  get,
  set,

  using,
  pushLast,
  concat,
  sort,
  or,
  defer,
  pipe,
}