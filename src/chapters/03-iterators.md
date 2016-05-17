# Chapter III: Iterators

{{ toc }}

## Introducing iterators

In the previous chapter, we learned how the for/of loop retains the powers of pull mode, while gaining powers of push mode. But to understand why that's the case, we have to look at iterators.

## First, a bit of theory

Fundamentally, iterators are an abstract way to represent a sequence. Before ES6, it was common to use arrays for this, but that's unworkable in at least two cases:

 1. **Open-ended sequences**: Sometimes it's useful to model *infinite or ridiculously long sequences*. For example, the set of all positive integers.
 2. **Lazy sequences**: Sometimes it's useful to model lazy sequences, which don't have a value until the moment the consumer asks for it. This can save both memory and CPU cycles.

Arrays come loaded with a lot of capabilities and assumptions, which makes them powerful but also means they can't do these things. Iterators have no such limitations, because they define a protocol comprising only the *minimum* operations for sequence traversal: A) what's the next thing? and B) are we done yet?

By establishing a set of minimal rules everyone agrees to follow, the protocol establishes separation of concerns. As long as you—the producer—implement the protocol, you're free to model a sequence however you want. As long as you—the consumer—adhere to this protocol, you're free to decide when to iterate and whether to bail out of the iteration.

Finally, because it's defined in the language, language-level hooks exist that make working with iterators ultra-simple. On the consumer side, this is the for/of loop. On the producer side, it's generators. But we're getting ahead of ourselves! First let's look at how these protocols work. There are actually two concepts in play—iterables and iterators—each with its own protocol.

## Concept: Iterables

Any *iterable* can (among other things) be for/of'd. Technically, an iterable is an object that implements the *iterable protocol*.

**The iterable protocol:** To implement the iterable protocol, an object must have a [[Symbol.iterator]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) property which is a function that receives no arguments and returns an *iterator*.

## Concept: Iterators

An *iterator* is any object that implements the *iterator protocol*. It's transient in that every time you loop an iterable, a new iterator is created and then discarded. It's stateful in that it remembers its current position in the sequence at any given time.

**The iterator protocol:** To implement the iterator protocol, an object must have a `next` method that can be called over and over until iteration is done, at which point the iterator is depleted. Every call to `next()` returns a `{done,value}` object. While the iterator isn't depleted, `done` will be false. After it's depleted, `done` will be true.

## Iteration protocols in action

Okay then, enough theory. Let's actually create an iterator from an array and then deplete it. (If you're using a modern browser, feel free to paste this code in your console and try it out.)

```js
// arrays are iterables, so let's create one
var array = [ 2, 4, 6 ];

// now we'll create an iterator
var itr = array[Symbol.iterator]();

// deplete the iterator
console.log(itr.next()); // { done: false, value: 2 }
console.log(itr.next()); // { done: false, value: 4 }
console.log(itr.next()); // { done: false, value: 6 }
console.log(itr.next()); // { done: true, value: undefined }
```

Obviously it would be better to consume the iterator using a loop:

```js
var itr = array[Symbol.iterator]();
while (true) {
  var next = itr.next();
  if (!next.done) {
    visit(next.value);
  } else {
    break;
  }
}
```

Finally, the above is just a manual way of doing what for/of loops do automatically:

```js
for (var n of array) {
  visit(n);
}
```

## Let's make our own iterable

In the above, we used an array, which is a native object that's iterable. Next, let's try making our own objects iterable. We'll have a `range()` function that returns an iterable representing a finite sequence of numbers. Our goal is to be able to do this:

```js
for (var n of range(3, 6)) { ... } // visits 3, 4, 5
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
      var done = value >= to;
      if (done) value = undefined;
      return { value, done };
    };
    return iterator;
  };
  return iterable;
}
```

This is a bit ugly, but never mind that for now. Feel free to try it out in your browser console.

## Making our own iterable, round two

Flushed with success, let's try making our binary search tree from the first chapter iterable. Our end goal is to be able to do this:

```js
for (var val of tree) { ... }
```

Here's all the ingredients laid out for us, we merely need to assemble them together:

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

If you're like me, this is where you get stuck. The tree-iteration algorithm *runs to completion*, which isn't what we want. Rather, we want it to run bit-by-bit as a result of calls to the `next()` method. Maybe I could instantiate the `queue` array at the top of the `[Symbol.iterator]` function, then get rid of the `while` loop and replace it with...

But wait. Stop. It turns out there's a better way. Enter *generators*.

----------------

{{ next }}

----------------

{{ toc }}
