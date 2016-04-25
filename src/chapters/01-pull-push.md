# Chapter I: Pull vs. push

{{ toc }}

## Looping collections

We'll kick things off by looking at *collections*, which is just a generic term for a thing that contains things. Some examples:

 * **Lists**: In a list, everything exists sequentially in a line, so looping is easy.
 * **Trees**: A tree has a non-linear branching structure, so looping it isn't so easy.

Terminology note: when you loop through a collection, we'll say that you're the *consumer*, while the collection is the *producer*.

## The pull model

Suppose we have a `list` and a `tree` variable. We'll consume these collections by *pulling* elements out sequentially. In the pull model, the consumer is fully in charge:

```js
for (var i=0; i<list.length; i++) {
  visit(list[i]);
}
```

Yes, there are easier ways to loop an array, but let's not get ahead of ourselves; we still have our `tree` to worry about! Consuming that is tougher, since how do you loop a non-linear thing? Let's assume it's a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree), where every node has the following:

 * A `value`
 * An optional `left` child node
 * An optional `right` child node

A bit of googling turns up an algorithm we can use to "loop" it:

```js
var queue = tree.root ? [tree.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  visit(node.value);
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

At least for me, it's annoying to have to memorize and type out this this pile of code every time I want to loop a tree, but since this is the pull model and I'm in charge, it falls to me to handle all this stuff.

## The push model

If you're at all familiar with JavaScript, the above examples likely seem unsatisfactory. Let's switch to the *push* model, in which the *producer* takes charge by providing an `each()` method that accepts a callback, which it uses to push values back at us. Let's assume both our list and our tree have such a method. Consuming them is a lot easier:

```js
list.each(elmt => visit(elmt));
tree.each(elmt => visit(elmt));
```

Not only have we written less code, but the messy details are encapsulated away from us, which is a much better separation of concerns.

## Unfortunate tradeoffs

So the push model wins, right? Sadly, in the process of switching from pull to push, we lost some power and flexibility:

 * We can't `return` the outer function from inside a callback.
 * We can't `break` or `continue` from inside a callback.
 * We can't `yield` or `await` from within a callback.

Those behaviors could be simulated using some sort of pre-agreed-upon signaling mechanism between the callback and the runner, but by then we've begun to re-invent the wheel, since the language gives us those capabilities for free with loops.

----------------

{{ toc }}
