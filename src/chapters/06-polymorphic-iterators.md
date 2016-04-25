# Chapter VI: Polymorphic iterators

{{ toc }}

## A rabbit hole

Having covered the basics of iteration and generators, we now take a break in order to go down a bit of a rabbit-hole.

Recall that iterators and iterables are separate things. Well, plot twist: Pretty much every *native* JavaScript iterator object self-referentially implements the iterable protocol by having a `[Symbol.iterator]` method which returns `this`. Thus, some objects end up being both iterators and iterables, simultaneously!

## Possibly confusing, but useful

If you're like me, this fact will hurt your brain... at first. But as it happens, there's a good reason for it, since it allows passing any iterator where an iterable is expected. Why would I want to do that, you ask? Because more than just `[Symbol.iterator]` methods can return iterators. For example, an ES6 `Map` has a `keys()` method that returns an iterator. Since it's also an iterable, this works:

```js
for (const key of map.keys()) {
  // ...
}
```

...otherwise you'd get a TypeError, since for/of only accepts an iterable.

## What does this mean for you?

This shakes out in a number of ways in practice.

### Always deal in iterables

You'll generally want to structure your programs to always work with iterables, never iterators. Along those lines, you should almost never be explicitly calling `[Symbol.iterator]()` and `iterator.next()`. Let for/of and other language-level constructs handle that for you. That way, no matter whether an iterable or iterator is passed to your program, as long as you treat it as an iterable, you're covered.

### Know your iterators

Iterators are *unicast* by design, meaning that when one consumer pulls out a value, no other consumer will ever see it. Thus, even though you've structured your code to deal exclusively in iterables, you're still sort of on the hook to know which things are actually iterators.

```js
var keys1 = Object.keys(obj); // iterable
var keys2 = map.keys(); // iterator

for (var x of keys1) { ... } // can do this again
for (var x of keys2) { ... } // can NOT do this again
```

Personally, I like to avoid explicitly storing references to iterators in variables. For example by calling `map.keys()` directly inside the for/of loop, I avoid having to remember whether variable X is a iterator in the first place:

```js
for (var x of map.keys()) { ... }
```

### When in doubt, don't

In many scenarios it's impossible to know, such as a function that accepts an iterable from somewhere else:

```js
function doStuff(iterable) {
  for (let x of iterable) {
    // process x
  }
}
```

In that case it's best to just never consume the iterable more than once.

----------------

{{ toc }}
