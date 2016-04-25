# Chapter IV: Generators

{{ toc }}

## The problem

In the last chapter we discussed how to make anything for/of-able by using iterators. But I got stuck trying to do it for a binary search tree. Recall where we left off:

```js
class Tree {

  // Assume various BST methods already exist
  // here like add() and remove()

  [Symbol.iterator]() {
    return {
      next() {
        // Put the algorithm here, maybe?
      }
    };
  }
}

// Our tree-traversal algorithm.
// Need to drop this in above somewhere...
var queue = this.root ? [this.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  // do something with node.value
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

Down in the guts of this tree-traversal algorithm, there's a point where we have the value in-hand. But since iteration is a pull model where the consumer is in charge, we can't just let the loop run to completion. We have to hand off the value, then suspend the loop mid-flight and wait... somehow.

## The solution

It turns out that *suspending and waiting* is exactly what generators do! The mechanics of this are discussed in more detail below, but let's just jump right to the solution, in which we declare `[Symbol.iterator]` as a generator by adding an asterisk `*`, drop our algorithm in wholesale, then hand off the value using `yield`.

```js
class Tree {
  // ...
  *[Symbol.iterator]() {
    var queue = this.root ? [this.root] : [];
    while (queue.length > 0) {
      var node = queue.shift();
      yield node.value; // <-- produce
      if (node.left) { queue.push(node.left); }
      if (node.right) { queue.push(node.right); }
    }
  }
}

// elsewhere...
for (const value of tree) {
  visit(value); // <-- consume
}
```

And because a generator returns an iterator, we've satisfied both the iterable and iterator protocols in one fell swoop.

## Okay, but *how* do generators work?

Essentially, what happens is that when the `*[Symbol.iterator]` generator function is called, instead of running our algorithm to completion, JavaScript puts it into a *paused* state, without running it.

Meanwhile, JavaScript returns an iterator "`itr`" to the caller. When `itr.next()` is called, JavaScript presses *play* on the algorithm, which runs right up until the point it encounters a `yield`, then pauses again. The yielded value is subsequently returned from `itr.next()` along with `done: false`.

```js
{ value: /* whatever was yielded */, done: false }
```

This happens anywhere between zero and infinity times. If/when the generator algorithm hits a `return` instead of a `yield` (the return can be either implicit or explicit) the returned value is returned from `itr.next()` along with `done: true`.

```js
{ value: /* whatever was returned */, done: true }
```

## Generator function syntax

You have the full power of JavaScript syntax available to you inside a generator. `yield x` sends `x` out to the consumer. `yield` (with nothing after it) sends `undefined`. Furthermore, `yield x` can go anywhere an expression is expected.

```js
var greeting = `Hello ${yield 4}`;
```

Each way of making a function has a variant which turns that function into a generator.

### Function declarations and expressions

```js
function* doStuff() { ... }
var doStuff = function*() { ... }
var doStuff = function* doStuff() { ... }
var obj = { doStuff: function*() { ... } }
```

### Object literal shorthand

```js
var obj = { *doStuff() { ... } }
var obj = { *[someExpression]() { ... } }
```

### Class method

```js
class Foo { *doStuff() { ... } }
class Foo { *[someExpression]() { ... } }
```

----------------

{{ toc }}
