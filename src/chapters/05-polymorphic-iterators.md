# Chapter V: Polymorphic iterators

{{ toc }}

## Pedantic distinctions

We now make a small detour to highlight a possibly confusing point which you'll run into sooner or later, so we might as well get it out of the way now. Recall that an *iterable* and an *iterator* are different things. Well, plot twist: some objects are both, simultaneously.

Which objects, you ask? Pretty much every *native* JavaScript iterator object. They do this by having a `[Symbol.iterator]` method which returns `this`. I don't know if this is sanctioned terminology, but I'm going to call this a *polymorphic iterator*.

## Possibly confusing, but useful

Polymorphic iterators add confusion because they blur the line between iterators and iterables. However, there's a good reason for it, since it allows using that iterator wherever an iterable is expected.

Why would I want to use an iterator where an iterable is expected, you ask? Because more than just `[Symbol.iterator]` methods can return iterators. For example, an ES6 `Map` has several methods that return iterators:

 * Map#keys()
 * Map#values()
 * Map#entries()

Suppose you have a map where you just want to loop over the keys, rather than key/value pairs. Since `Map#keys()` returns a polymorphic iterator, this will work:

```js
for (const key of map.keys()) {
  // ...
}
```

...otherwise you'd get a TypeError, since for/of expects an iterable.

## What does this mean for you?

This is a convenience to make it easier to work with iterators. It's a good idea to follow this pattern if you ever make your own iterators, but since generators return polymorphic iterators for you, you normally don't need to worry about it.

----------------

{{ toc }}
