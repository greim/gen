# Chapter II: The for/of loop

{{ toc }}

## A new twist

In the first chapter, we learned about tradeoffs between *pull* and *push* mode for consuming collections. However, ES6 introduces a new way of looping that we failed to take into account: the for/of loop.

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

Unlike push mode, for/of retains all the language-level powers of a loop:

 * You can `return` the outer function from inside the loop body.
 * You can `break` or `continue` iteration from inside the loop body.
 * You can `yield` from inside the loop body.

Unlike pull mode, for/of avoids problems with other kinds of loops:

 * We don't have to track any state (e.g. an "`i`" variable).
 * We don't need to worry about when to end the loop.
 * We don't need to know any specifics about the data structure.

In other words, for/of retains the benefits of the pull model, while also gaining many of the benefits of the push model.

## Lots of things are for/of-able

Above, we used for/of to loop an array. Other things you can for/of include:

 * key/value entries in a `Map`.
 * items in a `Set`.
 * characters in a string.
 * args in an `arguments` object.
 * DOM elements gotten from `document.querySelectorAll()` or `elmt.getElementsByClassName()`.

Okay so for/of is rad and we like it. But this raises the question: what makes something for/of-able? Do only built-in objects have this ability, or could our binary search tree from the last chapter also be for/of'd? That's where ES6 iterators come in, and it's the topic of the next chapter.

----------------

{{ next }}

----------------

{{ toc }}
