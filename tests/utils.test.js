const { get, set, transform, sort, pushLast, concat, defer:_, pipe, or } = require('../src/utils.js')

test('it can transform data', () => {
  let posts = [
    {
      username: "U1",
      title:    "T1",
      comments: ["C1", "C2"]
    },
    {
      username: "U1",
      title:    "T2",
      comments: ["C3", "C4", "C5"]
    },
    {
      username: "U2",
      title:    "T3",
      comments: ["C6", "C7"]
    },
  ];

  let users = transform({}, posts, (users, post) => {
    return set(users, get(post, 'username'), user => {
      return pipe(user, [
        _(set, 'posts',    _(pushLast, get(post, 'title'))),
        _(set, 'comments', _(concat,   get(post, 'comments', []))),
      ])
    });
  });

  expect(users).toStrictEqual({
    "U1": {
      posts:    ["T1", "T2"],
      comments: ["C1", "C2", "C3", "C4", "C5"]
    },
    "U2": {
      posts:    ["T3"],
      comments: ["C6", "C7"]
    },
  });
})

test('it can join multiple data', () => {
  let productTags = {
    'P1': ['T1', 'T3'],
    'P2': ['T4', 'T8'],
    'P3': ['T2', 'T6'],
  };

  let dateProducts = {
    '2022-01-01': ['P2'],
    '2022-01-02': ['P1', 'P3'],
  };

  let result = transform({}, dateProducts, (dates, products, date) => {
    return set(dates, date, tags => {
      return concat(tags, transform([], products, (tags, product) => {
        return concat(tags, get(productTags, product));
      }));
    });
  });

  expect(result).toStrictEqual({
    '2022-01-01': ['T4', 'T8'],
    '2022-01-02': ['T1', 'T3', 'T2', 'T6'],
  });
})

test('it can order objects', () => {
  let messages = [
    {emotes: {'<3': 2, ':D': 3}},
    {emotes: {'<3': 2, ':)': 3}},
    {emotes: {'<3': 2, ':)': 4}},
    {emotes: {'<3': 2}},
    {emotes: {'<3': 2, ':D': 2}},
    {emotes: {':/': 1}},
  ]

  let result = pipe({}, [
    _(transform, messages, (emotes, message) => {
      return transform(emotes, get(message, 'emotes', {}), (emotes, count, emote) => {
        return set(emotes, emote, current => or(current, 0) + count)
      })
    }),
    _(sort, (v1, v2) => {
      return v2 - v1;
    })
  ])

  // @NOTE: using Object.entries to ensure order
  expect(Object.entries(result))
    .toStrictEqual(Object.entries({
    '<3': 10,
    ':)': 7,
    ':D': 5,
    ':/': 1,
  }));
})