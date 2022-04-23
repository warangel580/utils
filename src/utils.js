let isArray = (data) => {
  return data instanceof Array;
}

let isNil = (data) => {
  return data === undefined || data === null;
}

let isFunction = (data) => {
  return typeof data === "function";
}

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

let get = (data, path, defaultValue) => {
  return data[path] || defaultValue;
}

let tap = (data, fn) => {
  fn(data);

  return data;
}

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

let set = (data, path, newValue) => {
  return tap(or(data, {}), data => {
    data[path] = isFunction(newValue)
      ? newValue(data[path])
      : newValue;
  });
}

let pushLast = (data, value) => {
  return tap(or(data, []), data => data.push(value));
}

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

let defer = (fn, ...args) => {
  return (data) => fn(data, ...args);
}

let pipe = (data, fns) => {
  return transform(data, fns, (data, fn) => {
    return fn(data);
  });
}

module.exports = {
  isArray,
  isNil,
  isFunction,
  reduce,
  transform,
  sort,
  get,
  set,
  tap,
  or,
  pushLast,
  concat,
  defer,
  pipe,
}