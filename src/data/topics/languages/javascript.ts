import { Topic } from '@/types';

export const javascript: Topic = {
  id: 'javascript',
  title: 'JavaScript',
  description: 'Dynamic, interpreted programming language for web development and beyond',
  category: 'languages',
  confidence: 'expert',
  keyPoints: [
    {
      title: 'Event Loop & Async',
      description: 'JavaScript is **single-threaded** with **non-blocking I/O**, powered by the event loop:\n\n- **Call Stack**: executes one function at a time (LIFO). When empty, the event loop picks the next task.\n- **Microtask Queue** (higher priority): `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`. **All** microtasks drain before moving to the next macrotask.\n- **Macrotask Queue**: `setTimeout`, `setInterval`, I/O callbacks, `requestAnimationFrame` (browser). One macrotask runs, then all microtasks drain, then the next macrotask.\n- **`async/await`**: syntactic sugar over Promises. `await` pauses the async function (but doesn\'t block the thread) and resumes when the promise settles. Under the hood, everything after `await` is a `.then()` callback.\n- **`Promise.all()`**: run promises in parallel, reject on first failure. **`Promise.allSettled()`**: wait for all, never rejects. **`Promise.race()`**: first to settle wins.',
    },
    {
      title: 'Closures & Scope',
      description: 'A **closure** is a function bundled with references to its surrounding **lexical scope** — it "remembers" the variables from where it was defined, even after that scope has exited:\n\n- Every function creates a closure. Inner functions can access outer variables, but not vice versa.\n- **Scope chain**: variable lookup goes from inner → outer → global. First match wins.\n- **Practical uses**: data privacy (module pattern), factory functions, memoization, event handler callbacks, partial application / currying.\n- **Common pitfall**: closures in loops capture the **variable binding**, not the value. Classic `var` loop bug: all callbacks share the same `i`. Fix: use `let` (block-scoped) or an IIFE.\n- **Memory**: closures keep referenced outer variables alive (preventing GC). Be careful with large objects captured unintentionally.',
    },
    {
      title: 'Prototypal Inheritance',
      description: 'JavaScript uses **prototypal inheritance** — objects inherit directly from other objects via the **prototype chain**:\n\n- Every object has an internal `[[Prototype]]` link (accessible via `Object.getPrototypeOf()` or `__proto__`).\n- Property lookup: if a property isn\'t on the object, JS walks up the prototype chain until it\'s found or reaches `null`.\n- **`class` syntax** (ES6) is syntactic sugar over prototypes — `class Foo extends Bar` sets up the prototype chain. Methods go on `Foo.prototype`.\n- **`Object.create(proto)`**: create a new object with `proto` as its prototype. Useful for **pure prototypal** patterns without constructors.\n- **`hasOwnProperty()`**: check if a property is directly on the object (not inherited). Or use `Object.hasOwn(obj, prop)` (ES2022).\n- Prototype chain ends at `Object.prototype` → `null`. `Object.create(null)` creates a "dict" object with **no prototype** (no inherited methods).',
    },
    {
      title: 'ES6+ Features',
      description: 'Modern JavaScript features (ES2015+) that are essential:\n\n- **Arrow functions**: `(x) => x * 2`. Lexically bind `this` (no own `this`). Cannot be used as constructors.\n- **Destructuring**: `const { name, age = 25 } = obj;` / `const [first, ...rest] = arr;` — extract values with defaults and renaming (`{ name: alias }`).\n- **Template literals**: `` `Hello ${name}` `` — multiline strings, expression interpolation. Tagged templates (`html\\`...\\``) for DSLs.\n- **Spread / Rest**: `[...arr1, ...arr2]` (spread), `function(...args)` (rest). Works on objects too: `{ ...obj1, ...obj2 }` (shallow merge).\n- **Optional chaining**: `user?.address?.city` — short-circuits to `undefined` instead of throwing. Works on methods: `obj.method?.()`.\n- **Nullish coalescing**: `value ?? fallback` — only falls back on `null` or `undefined` (unlike `||` which also catches `0`, `""`, `false`).\n- **`Map` / `Set`**: proper data structures. Map has any-type keys, preserves insertion order, and has `.size`. Set has unique values. Both are iterable.',
    },
    {
      title: 'this Keyword & Binding',
      description: 'The value of **`this`** depends on **how a function is called**, not where it\'s defined:\n\n- **Method call**: `obj.foo()` → `this` is `obj`\n- **Plain call**: `foo()` → `this` is `undefined` (strict mode) or `globalThis` (sloppy mode)\n- **Constructor**: `new Foo()` → `this` is the new object being created\n- **Explicit binding**: `fn.call(thisArg, ...args)`, `fn.apply(thisArg, [args])`, `fn.bind(thisArg)` (returns new function)\n- **Arrow functions**: **no own `this`** — inherit `this` from enclosing lexical scope. This is why arrow functions are great for callbacks but bad for methods on objects/prototypes.\n- **Event handlers**: `this` is the element that the listener was attached to (unless using arrow function)\n\nCommon bug: `const fn = obj.method; fn();` — loses `this` binding. Fix: `fn.bind(obj)`, `() => obj.method()`, or use an arrow function property.',
    },
    {
      title: 'Type Coercion & Equality',
      description: 'JavaScript\'s **dynamic typing** includes implicit type conversions that are notoriously confusing:\n\n- **`==` (loose equality)**: performs **type coercion** before comparison. Rules are complex: `null == undefined` is `true`, `0 == ""` is `true`, `false == 0` is `true`.\n- **`===` (strict equality)**: no coercion. Compares value AND type. **Always prefer `===`**.\n- **Truthy / falsy**: falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy (including `[]`, `{}`, `"0"`).\n- **`+` operator**: if either operand is a string, concatenates: `1 + "2"` = `"12"`. Use `Number(x)`, `parseInt(x, 10)`, or unary `+x` for explicit conversion.\n- **`Object.is()`**: like `===` but handles edge cases: `Object.is(NaN, NaN)` is `true` (unlike `===`), `Object.is(+0, -0)` is `false`.\n- **Best practice**: use `===`, explicit conversions, and `typeof` checks. Avoid clever coercion tricks in production code.',
    },
  ],
  quizQuestions: [
    {
      question: 'What is a closure and why is it useful?',
      answer: 'A closure is a function that retains access to its lexical scope\'s variables even after the outer function has returned. The inner function "closes over" the variables. Useful for data privacy (module pattern), factory functions, memoization, and maintaining state in callbacks. Every function in JS creates a closure.',
    },
    {
      question: 'How does the JavaScript event loop work?',
      answer: 'The event loop checks the call stack. When empty, it drains ALL microtasks (Promise callbacks, queueMicrotask), then picks ONE macrotask (setTimeout, I/O) and executes it. Then microtasks drain again, and so on. This is why Promise.then runs before setTimeout(fn, 0).',
    },
    {
      question: 'What is the difference between var, let, and const?',
      answer: 'var is function-scoped, hoisted (initialized as undefined), and can be redeclared. let is block-scoped, hoisted but NOT initialized (temporal dead zone), and can be reassigned. const is like let but cannot be reassigned (the binding is immutable, but objects/arrays it references can still be mutated).',
    },
    {
      question: 'Why do Promises resolve before setTimeout(..., 0)?',
      answer: 'Promise.then callbacks go to the microtask queue, setTimeout goes to the macrotask queue. After each macrotask completes, ALL microtasks are drained before the next macrotask. So even setTimeout(fn, 0) waits until all pending microtasks finish.',
    },
    {
      question: 'What is the difference between == and ===?',
      answer: '== (loose equality) performs type coercion before comparison — "1" == 1 is true. === (strict equality) compares without coercion, requiring both value AND type to match — "1" === 1 is false. Always use === to avoid surprising coercion bugs.',
    },
    {
      question: 'Why do arrow functions not have their own "this"?',
      answer: 'Arrow functions inherit "this" from their enclosing lexical scope at definition time. They were designed to solve the common problem of losing "this" in callbacks (e.g., setTimeout, event handlers, array methods). They cannot be used as constructors (no "new"), and cannot have their "this" rebound with call/apply/bind.',
    },
    {
      question: 'What is the temporal dead zone (TDZ)?',
      answer: 'The TDZ is the region from the start of a block to the point where a let/const variable is declared. Accessing the variable in this zone throws a ReferenceError, even though the declaration is hoisted. This prevents use-before-declaration bugs that var allows.',
    },
    {
      question: 'What is the difference between Object.freeze() and const?',
      answer: 'const prevents the BINDING from being reassigned (you can\'t do x = newValue). Object.freeze() prevents the OBJECT from being mutated (can\'t add, remove, or modify properties). They operate at different levels. const arr = [1,2,3]; arr.push(4) works because the array is mutated, not reassigned.',
    },
    {
      question: 'How does prototypal inheritance differ from classical inheritance?',
      answer: 'In prototypal inheritance, objects inherit directly from other objects via the prototype chain — there are no true "classes." JS class syntax is sugar over prototypes. Property lookup walks the chain until found or null. This is more flexible: you can modify prototypes at runtime, use Object.create() for delegation, and mix in behaviors.',
    },
    {
      question: 'What is the difference between null and undefined?',
      answer: 'undefined means a variable exists but has no value assigned (or a function has no return). null is an intentional absence of value — you explicitly set it. typeof undefined is "undefined", typeof null is "object" (historical bug). null == undefined is true, null === undefined is false.',
    },
    {
      question: 'What is the difference between Promise.all and Promise.allSettled?',
      answer: 'Promise.all short-circuits and rejects as soon as ANY promise rejects — you lose the results of successful promises. Promise.allSettled waits for ALL promises to settle (resolve or reject) and returns an array of objects with status "fulfilled" or "rejected" and value/reason. Use allSettled when you need all results regardless of failures.',
    },
    {
      question: 'What is optional chaining (?.) and nullish coalescing (??)?',
      answer: 'Optional chaining (obj?.prop) short-circuits to undefined if any part of the chain is null/undefined, avoiding "Cannot read property of undefined" errors. Nullish coalescing (a ?? b) returns b only if a is null or undefined — unlike || which also catches 0, "", and false. They pair well: user?.name ?? "Anonymous".',
    },
  ],
  codeExamples: [
    {
      title: 'Event Loop: Micro vs Macrotasks',
      language: 'javascript',
      code: `console.log('1: synchronous');

setTimeout(() => console.log('2: macrotask (setTimeout)'), 0);

Promise.resolve()
  .then(() => console.log('3: microtask (promise 1)'))
  .then(() => console.log('4: microtask (promise 2)'));

queueMicrotask(() => console.log('5: microtask (queueMicrotask)'));

console.log('6: synchronous');

// Output order:
// 1: synchronous
// 6: synchronous
// 3: microtask (promise 1)
// 5: microtask (queueMicrotask)
// 4: microtask (promise 2)
// 2: macrotask (setTimeout)

// Why? 
// 1. Synchronous code runs first (1, 6)
// 2. ALL microtasks drain (3, 5, then 4 which was queued by 3)
// 3. Then the macrotask runs (2)`,
      explanation: 'Microtasks (Promises, queueMicrotask) always run before macrotasks (setTimeout, setInterval). After each macrotask, the entire microtask queue drains before the next macrotask.',
    },
    {
      title: 'Closures, Scope & the Loop Pitfall',
      language: 'javascript',
      code: `// --- Closure for data privacy (Module Pattern) ---
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private via closure
  
  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
account.deposit(50);   // 150
account.withdraw(30);  // 120
// account.balance → undefined (private!)

// --- Classic loop pitfall ---
// BUG: var is function-scoped, so all callbacks share the same 'i'
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3
}

// FIX 1: Use let (block-scoped — each iteration gets its own 'i')
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0, 1, 2
}

// FIX 2: IIFE captures value at each iteration
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i); // 0, 1, 2
}`,
      explanation: 'Closures capture the variable BINDING, not the value. With var (function-scoped), all loop callbacks share one i. With let (block-scoped), each iteration creates a new binding.',
    },
    {
      title: 'this Binding & Prototypal Inheritance',
      language: 'javascript',
      code: `// --- "this" depends on HOW a function is called ---
const obj = {
  name: 'Alice',
  greet() { return \`Hello, \${this.name}\`; },
  greetArrow: () => \`Hello, \${this.name}\`, // inherits outer this!
};

obj.greet();        // "Hello, Alice" (method call: this = obj)
const fn = obj.greet;
// fn();            // TypeError or "Hello, undefined" (lost this)
fn.call(obj);       // "Hello, Alice" (explicit binding)
fn.bind(obj)();     // "Hello, Alice" (permanent binding)

// --- Prototypal Inheritance ---
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // super constructor
  this.breed = breed;
}
// Set up prototype chain: Dog inherits from Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

const rex = new Dog('Rex', 'Shepherd');
rex.speak(); // "Rex makes a sound" (inherited from Animal)
rex.bark();  // "Rex barks!" (own method)

// Modern equivalent with class syntax (sugar over the above):
class Cat extends Animal {
  constructor(name, color) {
    super(name);
    this.color = color;
  }
  purr() { return \`\${this.name} purrs\`; }
}`,
      explanation: '"this" is determined by the call site, not definition. Arrow functions have no own "this". Class syntax is sugar over the prototype chain — Dog.prototype = Object.create(Animal.prototype) is what extends does under the hood.',
    },
  ],
};
