# Chapter VI: Polymorphic iterators

{{ toc }}

## A rabbit hole

Having covered the basics of iteration and generators, we now take a break in order to go down a bit of a rabbit-hole.

Recall that iterators and iterables are separate things. Well, plot twist: Pretty much every *native* JavaScript iterator object implements the iterable protocol by having a `[Symbol.iterator]` method which returns itself. In effect, most iterators are both iterators and iterables, simultaneously!

## Possibly confusing, but useful

If you're like me, this will hurt your brain... at first. But there's a good reason for it, since it allows passing any iterator where an iterable is expected. Why would I want to do that, you ask? Because it allows doing this:

```js
for (const key of map.keys()) { ... }
```

As the `Map#keys()` method demonstrates, `object[Symbol.iterator]()` isn't the only thing that can return iterators. Some methods just return iterators directly. We definitely want the ability to use these in places where iterables are expected, such as for/of loops.

## What does this mean for you?

This shakes out in a number of ways in practice.

### Always deal in iterables

It's generally a good idea to structure your programs to always accept iterables, never iterators. Along those lines, you should almost never be explicitly calling `[Symbol.iterator]()` and `iterator.next()`. Let for/of and other language-level constructs handle that for you. That way, no matter whether an iterable or iterator is passed to your program, as long as you treat it as an iterable, you're covered.

### Know your iterators

Iterators are *unicast* by design, meaning that when one consumer pulls out a value, no other consumer will ever see it. Thus, even though you've structured your code to deal exclusively in iterables, you're still sort of on the hook to know which things are actually iterators.

```js
var keys1 = Object.keys(obj); // iterable
var keys2 = map.keys(); // iterator

for (var x of keys1) { ... } // can do this over and over again
for (var x of keys2) { ... } // can NEVER do this again
```

Personally, I like to avoid explicitly storing references to iterators in variables. For example by calling `map.keys()` directly inside the for/of loop, I sidestep the problem of having to remember whether variable X is a iterator in the first place:

```js
for (var x of map.keys()) { ... }
```

### Code defensively

In some scenarios you'll just be accepting with an object from somewhere else. You have no way of knowing whether it's an iterable or an iterator.

```js
function doStuff(iterable) {
  for (let x of iterable) { ... }
  // Now consider `iterable` to have
  // been consumed and don't try to
  // re-consume it.
}
```

In that case it's best to just never consume the iterable more than once.

----------------

{{ toc }}
