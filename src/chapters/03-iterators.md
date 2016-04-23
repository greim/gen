# Chapter III: Iterators

{{ toc }}

## Introducing *iteration*

In the previous chapter, we learned how the for/of loop retains the powers of the pull model, while gaining the powers of the push model. But to understand *why* this is the case, we have to look at iterators.

Here's a brief tour of the concepts involved. Take a look, and be sure to bookmark this spot for later as we dive into examples.

## Concept: Iterables

An *iterable* is any object that implements the *iterable protocol*. Any iterable can (among other things) be for/of'd. Lots of things you encounter on a daily basis are iterable, such as arrays and strings.

## Concept: The iterable protocol

To implement the iterable protocol, an object must have a `[Symbol.iterator]` property which is a function that receives no arguments and returns an *iterator*. ([Read more about symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).)

## Concept: Iterators

An *iterator* is any object that implements the *iterator protocol*. Notice that "iterable" and "iterator" are separate terms with separate meanings. This is important! An iterator is a temporary, stateful object, created by an iterable, which is used to consume a sequence once, and then thrown away. In other words, every time you loop an iterable, a new iterator is created.

## Concept: The iterator protocol

To implement the iterator protocol, an object must have a `next` method that can be called over and over until iteration is done, at which point the iterator is depleted. Every call to `next()` returns a `{done,value}` object. While the iterator isn't depleted, `done` will be false. After it's depleted, `done` will be true.

## Iteration protocols in action

To illustrate, let's create an iterator from an array and then deplete it by invoking the protocols manually.

```js
// create an iterable
var arr = [ 2, 4, 6 ];

// create an iterator
var itr = arr[Symbol.iterator]();

// deplete the iterator
console.log(itr.next()); // { done: false, value: 2 }
console.log(itr.next()); // { done: false, value: 4 }
console.log(itr.next()); // { done: false, value: 6 }
console.log(itr.next()); // { done: true, value: undefined }
```

...which we'll obviously want to make into a loop:

```js
var arr = [ 2, 4, 6 ];
var itr = arr[Symbol.iterator]();
while (true) {
  var next = itr.next();
  if (!next.done) {
    console.log(next.value);
  } else {
    break;
  }
}
```

...which is just a manual way of doing what for/of loops do for you automatically:

```js
var arr = [ 2, 4, 6 ];
for (var n of arr) {
  console.log(n);
}
```

## Iterators are conceptually yummy

Iterators bring some interesting ideas to the table.

 * **Separation of concerns**: In pre-ES6 pull/push scenarios, either the consumer or producer was fully in charge. With iterators, responsibility is more evenly split. The consumer is in charge of deciding if and when to pull out the next thing, while the producer is in charge of how to provide the thing. This is a better separation of concerns, and sets the state for everything that follows.
 * **Abstract sequences**: So far we've only looked at iterators as a way of looping a collection, but this is too conceptually narrow. Iterators go beyond collections, and even beyond for/of loops. Think of them as a general-purpose way to represent any *abstract sequence*.
 * **Infinite sequences**: The ability to represent any abstract sequence means that iterators can represent *infinite or really long sequences*. It's up to the consumer to decide how much of that sequence to consume before bailing out of the iteration.
 * **Lazy sequences**: A lazy sequence doesn't generate a value until the moment the consumer asks for it. This saves both memory and CPU cycles, especially in cases where consumers might bail out of iteration before exhausting the sequence. And of course infinite sequences aren't even possible unless they're lazy.

## Example 1: a range() function

Armed with all of this amazing theoretical machinery, let's try to implement the iterable protocol and make a `range()` function:

```js
// implementation
function range(from, to) {
  return {
    [Symbol.iterator]: function() { // <-- implementing iterable
      var i = from;
      return {
        next: function() { // <-- implementing iterator
          var value = i++;
          var done = value >= to;
          return { value, done };
        }
      }
    }
  };
}

// usage
for (var n of range(3, 5)) {
  console.log(n);
}
// => 3
// => 4
// => 5
```

Honestly, that was tedious to type out, and it's even more tedious to read. I'd probably avoid making iterators if it required doing this sort of thing regularly. But anyhow it works.

Note that it's is a *lazy sequence*: at no point do we retain the whole range in memory. Calling `range(0, Infinity)` is fine, as long as we don't try to exhaust the sequence!

## Example 2: binary search tree iteration

Flushed with success, let's try implementing iterable on our binary search tree from the first chapter. Here's all the ingredients laid out for us, we merely need to assemble them together, somehow:

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
  var value = node.value;
  // <-- Right here is where we have the value!
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

If you're like me, this is where you get stuck. The tree-iteration algorithm *runs to completion*, which isn't what we want. This is the pull model; we only want it to run bit-by-bit, at the request of the consumer. Maybe I could instantiate the `queue` array at the top of the `[Symbol.iterator]` function, then get rid of the `while` loop and replace it with...

But wait. Stop. It turns out there's a straightforward way to do this. Enter *generators*.

----------------

{{ toc }}
