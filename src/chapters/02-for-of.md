# Chapter II: The for/of loop

{{ toc }}

## A new kind of loop

In the first chapter, we learned about tradeoffs between *pull* and *push* mode for consuming collections. However, ES6 introduces a new way of looping that we failed to take into account: the for/of loop.

## Solving the pull/push conundrum

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

In other words, for/of retains the benefits of pull mode, while also gaining the benefits of push mode.

## What makes something for/of-able?

Above, we used for/of to loop an array, but it raises the question: what makes something for/of-able? Do only arrays have this ability, or could our binary search tree from the last chapter also be for/of'd? That's where ES6 iterators come in, and it's the topic of the next chapter.

----------------

{{ next }}

----------------

{{ toc }}
