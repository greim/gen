# Chapter VIII: Advanced topics

{{ toc }}

## It's dangerous to go alone...

The goal of this tutorial was to introduce generators as the centerpiece of iteration in ES6. With that done, we'll briefly look at a few advanced use cases. This isn't meant to be an exhaustive tour of everything about generators, just a few items to take with you as you leave and explore the world of generators on your own.

## A word of warning

Recall that iterators are stateful objects. When an iterator comes from a collection, it "remembers" its place in that collection at each step. Hence the rule: *Never modify a collection while iterating it.* Otherwise, things can go haywire since the iterator's state could be invalidated.

```js
// BAD!
for (const val of collection) {
  collection.remove(val);
}
```

## POJOs aren't iterable

Given that you can for/in loop over keys in a plain old JavaScript object (POJO), you could be forgiven for thinking POJOs are iterable. Well, [they're not](http://exploringjs.com/es6/ch_iteration.html#sec_plain-objects-not-iterable). You can use a Map instead, or a write yourself a utility generator function.

```js
function* iterObj(ob) {
  for (let key in ob) {
    if (ob.hasOwnProperty(key)) {
      yield [ key, ob[key] ];
    }
  }
}

for (const [ key, val ] of obj) { ... }
```

## Functional programming over sequences

Considering that iteration introduces a conceptual shift from *collections* to *abstract sequences*, collection-oriented libraries like lodash start to seem incomplete. Operations like map, filter, and reduce can just as easily operate on infinite or lazy sequences, for example. The [wu library](https://fitzgen.github.io/wu.js/) offers these kinds of capabilities, and can be thought of as "lodash for iterators":

```js
const evenSquares = wu(range(0, Infinity))
.map(n => n * n)
.filter(n => n % 2 === 0);

for (let n of evenSquares) {
  console.log(n);
}
// => 0
// => 4
// => 16
// => 36
// => ...
```

## Two-way communication

It's syntactically valid for `yield` or `yield x` to appear anywhere an expression is expected. For example:

```js
var myString = `Hello ${yield 4}`;
```

This raises the question: what end up being the contents of `myString`?

So far we've only looked at *consuming* information from generators. But here's yet another twist: if you have an iterator "`itr`" gotten from a generator, you can pass in an argument: `itr.next(someValue)`. Inside the generator, what this looks like is that a `yield` expression evaluates to `someValue`.

This is significant, because now instead of a one-way consumer/producer relationship, we have a two-way, "ping-pong" sort of relationship, with the generator sending things to its runner, and the runner sending things back to the generator.

```js
// generator
function* foo() {
  console.log(`Hello ${yield 1}!`); // 'Hello world!'
}

// runner
var itr = foo();
console.log(itr.next().value); // => 1
itr.next('world');
```

Not only can information be sent into a generator via `next()`, but so can errors via `throw()`, which inside the generator you handle like any other error, treating a `yield` as something that might throw an exception.

```js
function* foo() {
  try { yield 1; }
  catch(ex) { console.log(ex); } // 'oops'
}

var itr = foo();
console.log(itr.next().value); // 1
itr.throw('oops');
```

Note that these capabilities aren't part of the iterator protocol. Rather, they're extra powers that generator-created iterators have. [Read more about it here](http://www.2ality.com/2015/03/es6-generators.html#return%28%29-and-throw%28%29).

## Async generators

This two-way communication between a generator and its runner opens up new vistas in async flow control. A generator can yield promises out to a special runner, which resolves it and then "bounces" the resolved value right back into the generator, asynchronously. What this looks like inside a generator is that a `yield promise` expression evaluates to the resolved value of that promise, or else throws an exception.

Here's an example using the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is promise-based:

```js
// in the generator
var resp = yield fetch('/users/123');
console.log(resp.status);
var user = yield resp.json();
console.log(user.name);
```

This "trampoline" technique gives us callback-free async flow control. All we need is a runner function, which we'll call `coroutine()`, and a generator function to pass to it:

```js
const getUsername = coroutine(function*(id) {
  let resp = yield fetch(`/users/${id}`);
  var obj = yield resp.json();
  if (resp.status === 200) return obj.username;
  else throw new Error(obj.errorMessage);
});

const getGreeting = coroutine(function*() {
  const myId = localStorage.getItem('my_id');
  if (!myId) throw new Error('not logged in');
  else return `Hello, ${yield getUsername(myId)}`;
});

getGreeting().then(
  greeting => alert(greeting),
  error => alert(error.message)
);
```

Observations:

 * `coroutine()` accepts a generator and returns a function, both of which have the same signature and `this` context.
 * `yield somePromise` expressions inside the generator either evaluate to a value or throw, depending on whether `somePromise` resolves or rejects.
 * Calls to the returned function return a promise which resolves to the return value of the generator.
 * Thrown exceptions inside the generator reject the returned promise.

The upshot is that we retain the power of asynchronous programming, while gaining the power of imperative, synchronous-style programming. No more callback hell, or thenable heck!

All of this of course depends on having a `coroutine()` function that does the right thing. Fortunately, there are multiple libraries to choose from here, including [co](https://www.npmjs.com/package/co), [Bluebird.coroutine](https://www.npmjs.com/package/bluebird), and [Q.spawn](https://github.com/kriskowal/q).

Finally, it's worth noting that this approach is so powerful that it inspired the [async functions](https://jakearchibald.com/2014/es7-async-functions/) proposal. As of early 2016, it's a stage 3 EcmaScript proposal.

----------------

{{ next }}

----------------

{{ toc }}
