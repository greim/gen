# Chapter I: The pull/push conundrum

{{ toc }}

## Looping collections

We'll kick things off by considering ways to loop through two common data structures: trees and lists.

 * **Lists**: In a list, everything exists sequentially in a line, so looping is easy.
 * **Trees**: A tree has a non-linear branching structure, so looping it isn't so easy.

Terminology note: when you loop through a collection, we'll say that you're the *consumer*, while the collection is the *producer*.

## The pull model

So then, suppose we have a `list` and a `tree` variable, which we'll consume using the pull model. Think of the pull model as "I'll call you." In other words, *the consumer is in charge* of pulling things out:

```js
for (var i=0; i<list.length; i++) {
  visit(list[i]);
}
```

Consuming the tree is harder, since how do you loop a non-linear thing? Let's assume it's a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree). A bit of googling turns up an algorithm we can use:

```js
var queue = tree.root ? [tree.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  visit(node.value);
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

It would be annoying to have to type out this this pile of code every time I want to loop a tree, but since this is the pull model and I'm in charge, the responsibility falls to me.

## The push model

If you're familiar with JavaScript, you're probably thinking there are much better ways to do this, and you're right! Let's switch to the push model, AKA "you call me." In the push model, *the producer is in charge* by providing an `each()` method that accepts a callback, which it uses to push values back at us. Let's assume both our list and our tree have such a method. Suddenly everything's a lot easier:

```js
list.each(elmt => visit(elmt));
tree.each(elmt => visit(elmt));
```

Not only have we written less code, but the messy details are encapsulated away from us, which is a great separation of concerns.

## Unfortunate tradeoffs

So the push model wins, right? Sadly, in the process of switching from pull to push, we lost some power and flexibility:

 * We can't `return` the outer function from inside a callback.
 * We can't `break` or `continue` from inside a callback.
 * We can't `yield` from within a callback.

Those behaviors could be simulated using some sort of pre-agreed-upon signaling mechanism between the callback and its runner, but by then we've begun to re-invent the wheel, since the language gives us those capabilities for free with loops.

----------------

{{ next }}

----------------

{{ toc }}
