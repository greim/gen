# Chapter I: The pull/push conundrum

{{ toc }}

## Looping collections

We'll kick things off by considering two common data structures: trees and lists. In a list, everything exists sequentially in a line, so looping is easy. A tree has a non-linear branching structure, so looping it isn't so straightforward.

*Terminology note: when you loop through a collection, we'll say that you're the consumer, while the collection is the producer.*

## Pull mode

As chunks of data are transferred from producer to consumer, "pull mode" just means that the consumer initiates each transfer, while the producer simply waits to be read from. It might sound complicated, but all it is is this:

```js
for (var i=0; i<list.length; i++) {
  visit(list[i]);
}
```

Consuming a tree in pull mode is slightly more complicated. Let's assume it's a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree). A bit of googling turns up an algorithm we can use:

```js
var queue = tree.root ? [tree.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  visit(node.value);
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

It would be annoying to have to type out this pile of code every time I want to loop a tree, but since I'm the one initiating the transfer, the task falls to me.

## Push mode

Which raises the question: why should I be the one to initiate the transfers? Why not let producer do it? Hence push mode, in which the collection has an `each()` method that accepts a callback, which it uses to push values to us.

```js
list.each(elmt => visit(elmt));
tree.each(elmt => visit(elmt));
```

The messy details still exist in the implementations of the `each()` method, but they're encapsulated away from us, which is a great separation of concerns.

## Unfortunate tradeoffs

So push mode wins, right? Sadly, by switching from pull to push, we lost some power and flexibility:

 * We can't `return` the outer function from inside a callback.
 * We can't `break` or `continue` from inside a callback.
 * We can't `yield` from within a callback.

Those behaviors could be simulated using some sort of pre-agreed-upon signaling mechanism between the callback and its runner, but by then we've begun to re-invent the wheel, since the language gives us those capabilities for free with loops.

----------------

{{ next }}

----------------

{{ toc }}
