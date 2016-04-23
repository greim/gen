# Chapter VI: Delegation and recursion

{{ toc }}

## Revisiting our tree traversal

In a previous chapter, we pimped out our binary search tree with generator-based iteration. Venturing a bit further down that rabbit hole, we note that we used [breadth-first iteration](https://en.wikipedia.org/wiki/Breadth-first_search), meaning that we visited every value at the child level before moving to the grandchild level, etc.

```js
// a breadth-first tree traversal algorithm
var queue = this.root ? [this.root] : [];
while (queue.length > 0) {
  var node = queue.shift();
  yield node.value;
  if (node.left) { queue.push(node.left); }
  if (node.right) { queue.push(node.right); }
}
```

This technique works, but ignores the innate sorting properties of binary search trees. To fix this, we want to switch to [in-order iteration](https://en.wikipedia.org/wiki/Tree_traversal#In-order). The easiest way to do that is to use recursion, which means our generator will have to call itself.

The way our tree works is that we have a `Tree` class and an inner `Node` class. Instances of `Tree` have a root which is undefined if the tree is empty. Otherwise, it's an instance of `Node`, which in turn can have left and right children, themselves instances of `Node`, and so on.

```
tree (Tree)
└──root (Node)
   ├──value: 5
   ├──left (Node)
   │  ├──value: 3
   │  ├──left (Node)
   │  │  ├──value: 2
   │  │  ├──left (undefined)
   │  │  └──right (undefined)
   │  └──right (Node)
   │     ├──value: 4
   │     ├──left (undefined)
   │     └──right (undefined)
   └──right (Node)
      ├──value: 7
      ├──left (undefined)
      └──right (undefined)
```

## Adding recursion to a generator: attempt one

We'll make both `Tree` and `Node` iterable, and have `Tree` delegate to its root `Node`, if it exists. Then the root will recursively delegate to its left and right children, if they exist, etc.

```js
class Tree {
  // ...
  *[Symbol.iterator]() {
    if (this.root) {
      for (const val of this.root) {
        yield val;
      }
    }
  }
}

class Node {
  // ...
  *[Symbol.iterator]() {
    if (this.left) {
      for (const val of this.left) {
        yield val;
      }
    }
    yield this.value;
    if (this.right) {
      for (const val of this.right) {
        yield val;
      }
    }
  }
}
```

Since `[Symbol.iterator]` has a for/of loop which calls `[Symbol.iterator]` on its children, we have recursion. However, we've written too much code! It turns out that generators have a much easier way to do delegation.

## Generator delegation

Generators have the ability to delegate to any iterable. Whenever we `yield* obj`, where `obj` is iterable, we inline that sequence into the sequence we're generating. Read `yield* foo` as *yield all the things in foo*. All sorts of arbitrarily-deeply nested delegation could be happening, but in the end, the consumer just sees a flat stream.

```js
function* a() {
  yield 1;
  yield* arr;
  yield 2;
}

var arr = [ 3, 4 ];

for (let n of a()) {
  console.log(n);
}
// => 1
// => 3
// => 4
// => 2
```

Important point: generators can delegate to *any iterable*, not just ones created by generators!

## Adding recursion to a generator: attempt two

Going back and applying this to our tree, we get this:

```js
class Tree {
  // ...
  *[Symbol.iterator]() {
    if (this.root) yield* this.root;
  }
}

class Node {
  // ...
  *[Symbol.iterator]() {
    if (this.left) yield* this.left;
    yield this.value;
    if (this.right) yield* this.right;
  }
}
```

Read as: *yield all the things on the left, then yield this thing, then yield all the things on the right*. And voila! We have an in-order iteration that visits every value in the tree.

----------------

{{ toc }}
