# Chapter II: The for/of loop

{{ toc }}

## A new twist

In the first chapter, we learned about tradeoffs between the *pull* and *push* models for consuming collections. However, ES6 introduces a new twist on the pull model that we didn't take into account before: the for/of loop.

## Yay for/of loops!

Compare these two ways of looping an array:

```js
for (var i=0; i<arr.length; i++) {
  var value = arr[i];
  visit(value);
}

for (var value of arr) {
  visit(value);
}
```

Unlike what we saw in the push model, for/of retains all the language-level powers of a loop:

 * You can `return` the outer function from inside the loop body.
 * You can `break` or `continue` iteration from inside the loop body.
 * You can `yield` or `await` from inside the loop body.

Also note the ways for/of differs from other loops:

 * We don't have to track any state (e.g. an "`i`" variable).
 * We don't need to worry about when to end the loop.
 * We don't need to know any specifics about the data structure.

In other words, for/of retains the benefits of the pull model, while also gaining benefits of the push model!

## Lots of things are for/of-able

Arrays are just one of many things in ES6 can be for/of'd, including:

 * Maps
 * Sets
 * Strings
 * Function arguments objects
 * DOM collections

This raises the question: what makes something for/of-able? Are only built-in objects for/of-able, or could our binary search tree from the last chapter also be looped using for/of? That's where ES6 iterators come in, and it's the topic of the next chapter.

----------------

{{ toc }}
