# Chapter X: Where is iteration used?

{{ toc }}

## What else can iterators do?

The power of iteration is the power of generators, and vice versa. Thus, even though this is a tutorial about generators, we continue exploring iteration. The fact is, for/of isn't the only place where ES6 natively supports iteration. Here are a few others.

### Spread operators

```js
function* foo() { yield 'a', yield 'b', yield 'c'; }
function bar() { console.log(arguments); }
bar(...foo()); // => { 0: 'a', 1: 'b', 2: 'c' }
```

```js
function* foo() { yield 1, yield 2, yield 3; }
console.log([...foo()]); // => [ 'a', 'b', 'c' ]
```

### Destructuring

```js
function* foo() { yield 1, yield 2, yield 3; }
const [ x, y, z ] = foo();
console.log(x); // => 1
console.log(y); // => 2
console.log(z); // => 3
```

### Construction of maps and sets

```js
function* foo() { yield 1, yield 2, yield 3; }
const set = new Set(foo());
console.log(set.has(1)); // => true
console.log(set.has(2)); // => true
console.log(set.has(3)); // => true
```

```js
function* foo() { yield ['a', 1], yield ['b', 2]; }
const map = new Map(foo());
console.log(map.get('a')); // => 1
console.log(map.get('b')); // => 2
```

### Array.from()

```js
function* foo() { yield 1, yield 2, yield 3; }
console.log(Array.from(foo())); // => [ 1, 2, 3 ]
```

### Promise.all()

```js
function* foo() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}
Promise.all(foo()).then(arr => {
  console.log(arr); // => [ 1, 2, 3 ]
});
```

### Generator delegation

```js
function* foo() { yield 1, yield 2, yield 3; }
function* bar() { yield* foo(); }
const arr = Array.from(bar());
console.log(arr); // => [ 1, 2, 3 ]
```

----------------

{{ toc }}
