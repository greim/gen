# Chapter V: Polymorphic iterators

{{ toc }}

## A rabbit hole

Having covered the basics of iteration and generators, we now take a break in order to go down a small rabbit-hole.

Recall that iterators and iterables are separate things. Well, plot twist: Pretty much every *native* JavaScript iterator object implements the iterable protocol by having a `[Symbol.iterator]` method which returns itself. In effect, most iterators are both iterators and iterables, simultaneously!

## Possibly confusing, but useful

If you're like me, this will hurt your brain... at first. But there's a good reason for it, since it allows passing any iterator where an iterable is expected. Why would I want to do that, you ask? Because it allows doing this:

```js
for (const key of map.keys()) { ... }
```

As the `Map#keys()` method demonstrates, `object[Symbol.iterator]()` isn't the only thing that can return iterators. Some methods return iterators directly. We definitely want the ability to use these in places where iterables are expected, such as for/of loops.

## What does this mean for you?

This shakes out in a number of ways in practice.

### Always deal in iterables

It's generally a good idea to structure your programs to always accept iterables, never iterators specifically. Along those lines, you should almost never be explicitly calling `[Symbol.iterator]()` and `iterator.next()`. Let for/of and other language-level constructs handle that for you. That way, no matter whether an iterable or iterator is passed to your program, as long as you treat it as an iterable, you're covered.

### Don't bother manually implementing the iterator protocol

While it's great to understand the iterator protocol, in the vast majority of cases it's better to just let generators create them for you. Not only is it easier, but then your iterators can be used wherever iterables are expected.

### Avoid double-consuming an iterator

Iterators are *unicast* by design, meaning that when one consumer pulls out a value, no other consumer will ever see it. Thus, even though you've structured your code to deal exclusively in iterables, you're still sort of on the hook to know which things are actually iterators.

```js
var keys1 = Object.keys(obj); // iterable
var keys2 = map.keys(); // iterator

for (var x of keys1) { ... } // can do this over and over again
for (var x of keys2) { ... } // can NEVER do this again
```

Personally, I prefer to sidestep the issue by not storing references to iterators in variables. For example, by calling `map.keys()` directly inside the for/of loop, I avoid the temptation to try to re-iterate that variable later on:

```js
for (var x of map.keys()) { ... }
```

### When in doubt, don't double-consume

Sometimes you'll just be accepting an object from somewhere else. In that case you have no way of knowing whether it's an iterable or an iterator, and it's best to avoid double-consumption.

```js
function doStuff(iterable) {
  for (let x of iterable) { ... }
  // Now consider `iterable` to have
  // been consumed and don't try to
  // re-consume it.
}
```

----------------

{{ next }}

----------------

{{ toc }}
