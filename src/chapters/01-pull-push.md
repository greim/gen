# Chapter I: The pull/push conundrum

{{ toc }}

## Looping collections

We'll kick things off by looping two kinds of data structures: trees and arrays. In an array, everything exists sequentially in a line, so looping is easy. A tree has a non-linear branching structure, so looping it isn't so straightforward. Also, terminology note: when you loop through a collection, we'll say that you're the **consumer**, while the collection is the **producer**.

## Pull mode

As data flows from producer to consumer, "pull mode" just means that the consumer initiates the transfer at each step, while the producer more or less acts like an inert data structure that can be read from. It might sound complicated, but all it means is this:

```js
for (var i=0; i<array.length; i++) {
  visit(array[i]);
}
```

Looping the array was fairly easy. Looping a tree is slightly more complicated. Let's assume it's a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree). A bit of googling turns up an algorithm we can use:

```js
var queue = tree.root ? [tree.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  visit(node.value);
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

It would be annoying to have to type out this pile of code every time I want to loop a tree, but since I'm initiating the transfer, the task falls to me.

## Push mode

Which raises the question: why should I initiate the transfer? Why not let producer do it? Hence push mode, in which the collection has a `forEach()` method that accepts a callback, which it uses to *push* values to us.

```js
array.forEach(elmt => visit(elmt));
tree.forEach(elmt => visit(elmt));
```

Much better. The various state tracking and algorithmic details are encapsulated away from us inside the `forEach()` method, which is a great separation of concerns.

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
