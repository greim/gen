# Chapter III: Iterators

{{ toc }}

## Introducing *iterators*

In the previous chapter, we learned how the for/of loop retains the powers of the pull model, while gaining powers of the push model. But to understand *why* this is the case, we have to look at iterators.

## A theory of abstract sequences

Fundamentally, iterators are an abstract representation of *sequences*. Before ES6 came along, it was common to use arrays as the go-to model for a sequence, but this ends up being unworkable in at least two cases:

 1. **Infinite sequences**: Sometimes it's useful to model *infinite or ridiculously long sequences*, for example, the set of all positive integers. Certainly you wouldn't ever try to exhaust such a sequence, but open-ended systems nevertheless have their uses.
 2. **Lazy sequences**: A lazy sequence doesn't have a value until the moment the consumer asks for it, which saves both memory and CPU cycles, especially in cases when only part the sequence is consumed.

Iterators are easily capable of modeling both scenarios.

## Separation of concerns

Iterators are able to represent abstract sequences by implementing proper *separation of concerns*. In pre-ES6 pull/push scenarios, recall that either the consumer or the producer was fully in charge. With iterators, responsibility is split. The consumer is in charge of deciding if and when to pull out the next thing, while the producer is in charge of how to provide the thing.

This frees you up to model a sequence however you see fit.

## How do iterators work?

Having looked at the theory behind iterators, let's dive into how they work. Here's an overview of the concepts involved.

## Concept: Iterables

An *iterable* is any object that implements the *iterable protocol*. Among other things, any iterable can be for/of'd. Lots of things you encounter on a daily basis are iterable, such as arrays and strings.

## Concept: The iterable protocol

To implement the iterable protocol, an object must have a `[Symbol.iterator]` property which is a function that receives no arguments and returns an *iterator*. ([Read more about symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).)

## Concept: Iterators

An *iterator* is any object that implements the *iterator protocol*. Notice that "iterable" and "iterator" are separate terms with separate meanings! An iterator is an object created by an iterable which is used to consume a sequence once. It's *stateful* in the sense that it remembers its current position in the sequence. It's *transient* in the sense that every time you loop an iterable, a separate iterator is created and then discarded at the end.

## Concept: The iterator protocol

To implement the iterator protocol, an object must have a `next` method that can be called over and over until iteration is done, at which point the iterator is depleted. Every call to `next()` returns a `{done,value}` object. While the iterator isn't depleted, `done` will be false. After it's depleted, `done` will be true.

## Iteration protocols in action

Now that we've talked about the iterable and iterator protocols, let's see how they work. We'll create an iterator from an array and then deplete it. (If you're using a modern browser, feel free to paste this code in your console and try it out.)

```js
// this is our iterable
var array = [ 2, 4, 6 ];

// create an iterator
var itr = array[Symbol.iterator]();

// deplete the iterator
console.log(itr.next()); // { done: false, value: 2 }
console.log(itr.next()); // { done: false, value: 4 }
console.log(itr.next()); // { done: false, value: 6 }
console.log(itr.next()); // { done: true, value: undefined }
```

Obviously we'll want to make that into a loop:

```js
var itr = array[Symbol.iterator]();
while (true) {
  var next = itr.next();
  if (!next.done) {
    console.log(next.value);
  } else {
    break;
  }
}
```

...which is just a manual way of doing what for/of loops do automatically:

```js
for (var n of array) {
  console.log(n);
}
```

## Example 1: a range() function

Next, let's try to implement the iterable protocol on our own object. We'll have a `range()` function that represents a sequence of numbers from X to Y. Our goal is to be able to do this:

```js
for (var n of range(3, 5)) { ... }
```

Here's the code:

```js
function range(from, to) {
  var iterable = {};
  // implement iterable protocol
  iterable[Symbol.iterator] = function() {
    var i = from;
    var iterator = {};
    // implement iterator protocol
    iterator.next = function() {
      var value = i++;
      var done = to > value;
      if (done) value = undefined;
      return { value, done };
    };
    return iterator;
  };
  return iterable;
}
```

Ugh, that was tedious to type out, and it's even more tedious to read. I'd probably avoid making iterators if it required doing this sort of thing regularly. But all of that aside, it works!

Note that it's is a *lazy sequence*; at no point do we retain the whole range in memory. Calling `range(0, Infinity)` is fine, performance-wise, as long as we don't try to exhaust the sequence!

## Example 2: binary search tree iteration

Flushed with success, let's try implementing iterable on our binary search tree from the first chapter. Our end goal is to be able to do this:

```js
for (var val of tree) { ... }
```

Here's all the ingredients laid out for us, we merely need to assemble them together, somehow:

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

// Our tree-iteration algorithm.
// Need to drop this in above somewhere...
var queue = this.root ? [this.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  // do something with node.value
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

If you're like me, this is where you get stuck. The tree-iteration algorithm *runs to completion*, which isn't what we want. This is the pull model; we only want it to run bit-by-bit, at the request of the consumer. Maybe I could instantiate the `queue` array at the top of the `[Symbol.iterator]` function, then get rid of the `while` loop and replace it with...

But wait. Stop. It turns out there's a straightforward way to do this. Enter *generators*.

----------------

{{ toc }}
