import { Topic } from '@/types';

export const typescript: Topic = {
  id: 'typescript',
  title: 'TypeScript',
  description: 'Typed superset of JavaScript that compiles to plain JavaScript',
  category: 'languages',
  confidence: 'expert',
  keyPoints: [
    {
      title: 'Static Type System',
      description: 'TypeScript adds a **compile-time** type system on top of JavaScript — types are **erased** at runtime (no performance cost):\n\n- **Type inference**: TS infers types from assignments (`const x = 5` → `number`), function returns, and generic usage. You often don\'t need explicit annotations.\n- **Structural typing** ("duck typing"): compatibility is based on **shape**, not name. If object A has all properties of type B, A is assignable to B — even without `implements`.\n- **`strict` mode** (`tsconfig.json`): enables `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc. **Always** enable this. Without strict, TS is significantly less safe.\n- **Type narrowing**: TS automatically narrows types in conditional blocks (`if (typeof x === "string")`, `if (x !== null)`, `if ("prop" in obj)`).\n- **Declaration files** (`.d.ts`): describe the types for JavaScript libraries. `@types/` packages on npm (e.g., `@types/react`). `declare` keyword for ambient declarations.',
    },
    {
      title: 'Interfaces & Type Aliases',
      description: '**Interfaces** and **type aliases** both define the shape of data, with key differences:\n\n- **Interface** (`interface User { name: string }`): best for **object shapes**. Supports **declaration merging** (multiple declarations of the same interface are merged) and **extends** for inheritance.\n- **Type alias** (`type ID = string | number`): can represent **anything** — unions, intersections, primitives, tuples, mapped types. Cannot be merged.\n- **When to use which**: use `interface` for public APIs and object contracts (extendable). Use `type` for unions, computed types, and everything non-object.\n- **`extends` vs `&`**: `interface B extends A` and `type B = A & Extra` both create subtypes. `extends` gives better error messages; `&` is for inline composition.\n- **Index signatures**: `{ [key: string]: number }` or `Record<string, number>` for dynamic keys.\n- **Optional / readonly**: `name?: string` (optional), `readonly id: number` (immutable after creation).',
    },
    {
      title: 'Generics',
      description: 'Generics create **reusable, type-safe** abstractions that work with multiple types:\n\n- **Function generics**: `function identity<T>(value: T): T` — the type is inferred from usage or explicitly specified: `identity<string>("hello")`.\n- **Constraints**: `<T extends HasLength>` restricts T to types with a `length` property. Use `extends` to bound generics.\n- **Multiple type params**: `function map<T, U>(arr: T[], fn: (item: T) => U): U[]`\n- **Generic interfaces/classes**: `interface Repository<T> { find(id: string): T }` — concrete implementations specify T.\n- **Default types**: `<T = string>` provides a default when not specified.\n- **Conditional types**: `type IsString<T> = T extends string ? "yes" : "no"` — compute types based on conditions.\n- **`infer` keyword**: extract types within conditional types: `type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never` (this is how `ReturnType<T>` works).',
    },
    {
      title: 'Union & Intersection Types',
      description: 'Two fundamental ways to **compose types**:\n\n- **Union** (`A | B`): the value is **one of** the types. Must only use members common to all types unless you **narrow** first. `string | number` means the value is either string or number.\n- **Intersection** (`A & B`): the value has **all** properties of both types. Used for **mixins** and extending: `type Admin = User & { permissions: string[] }`.\n- **Discriminated unions**: union of object types sharing a **literal discriminant** property. TS performs **exhaustive narrowing**:\n  ```\n  type Shape = \n    | { kind: "circle"; radius: number }\n    | { kind: "square"; side: number }\n  ```\n  Check `shape.kind` in a switch — TS knows the exact type in each case. The `never` type in the `default` ensures you handle all variants.\n- **Literal types**: `"GET" | "POST"` — restrict to specific string values. Use `as const` for const assertions: `const dirs = ["N", "S"] as const` → `readonly ["N", "S"]`.',
    },
    {
      title: 'Utility Types',
      description: 'TypeScript provides **built-in utility types** for common type transformations:\n\n- **`Partial<T>`**: all properties optional — useful for update/patch operations\n- **`Required<T>`**: all properties required\n- **`Readonly<T>`**: all properties readonly\n- **`Pick<T, K>`**: select subset of properties: `Pick<User, "name" | "email">`\n- **`Omit<T, K>`**: exclude properties: `Omit<User, "password">`\n- **`Record<K, V>`**: object type with keys K and values V: `Record<string, number>`\n- **`Exclude<T, U>`**: remove union members: `Exclude<"a" | "b" | "c", "a">` → `"b" | "c"`\n- **`Extract<T, U>`**: keep only matching union members\n- **`NonNullable<T>`**: remove `null` and `undefined`\n- **`ReturnType<T>`**: extract function return type\n- **`Parameters<T>`**: extract function parameter types as a tuple\n- **`Awaited<T>`**: unwrap `Promise<T>` recursively: `Awaited<Promise<Promise<string>>>` → `string`\n\nThese are implemented using **mapped types** and **conditional types** — you can build your own!',
    },
    {
      title: 'Type Guards & Narrowing',
      description: 'Type guards let you **narrow** a type at runtime so TypeScript knows the specific type in a block:\n\n- **`typeof`**: works for primitives: `if (typeof x === "string") { x.toUpperCase() }`\n- **`instanceof`**: works for classes: `if (err instanceof TypeError) { err.message }`\n- **`in` operator**: checks property existence: `if ("email" in user) { user.email }`\n- **Truthiness narrowing**: `if (x) { ... }` eliminates `null`, `undefined`, `0`, `""`, etc.\n- **Equality narrowing**: `if (x === null)` or `if (x !== undefined)`\n- **Custom type predicates**: functions that return `paramName is Type`:\n  ```\n  function isString(x: unknown): x is string {\n    return typeof x === "string";\n  }\n  ```\n  After calling `if (isString(val))`, TS knows `val` is `string` in that block.\n- **Assertion functions**: `function assert(val: unknown): asserts val is string` — narrows the type after the call (throws if not valid).\n- **`satisfies` operator** (TS 4.9+): validate a value matches a type without widening: `const cfg = { ... } satisfies Config` — keeps literal types but checks against Config.',
    },
  ],
  quizQuestions: [
    {
      question: 'What is the difference between interface and type in TypeScript?',
      answer: 'Both define object shapes, but interfaces support declaration merging (multiple declarations are combined) and extends. Types can represent unions, intersections, primitives, tuples, and mapped types. Use interface for public object contracts (extendable), type for unions and computed types.',
    },
    {
      question: 'What are generics and why are they useful?',
      answer: 'Generics allow creating reusable components that work with multiple types while maintaining type safety. Example: Array<T> works with any type T without losing type information. They enable writing a function once that handles strings, numbers, custom objects, etc., with full IntelliSense and error checking.',
    },
    {
      question: 'What is a discriminated union and when would you use it?',
      answer: 'A union of object types sharing a common literal property (discriminant), e.g., { kind: "circle"; radius: number } | { kind: "square"; side: number }. Switch on the discriminant and TS knows the exact type in each case. Use "never" in default to ensure exhaustive handling. Useful for state machines, API responses, and result types.',
    },
    {
      question: 'What does the unknown type do vs any?',
      answer: 'unknown is type-safe — you must narrow it (with typeof, instanceof, or type predicates) before using it. any bypasses ALL type checking. unknown is the safe version of any: use it for values of uncertain type (API responses, user input), then narrow before accessing properties.',
    },
    {
      question: 'What is the difference between never and void?',
      answer: 'void means a function returns undefined (or has no return value). never means a function NEVER returns — it either throws an error or has an infinite loop. never is the "bottom type" — it\'s assignable to every type but no type is assignable to it (except never). It appears in exhaustive checks and impossible states.',
    },
    {
      question: 'What is structural typing and how does it differ from nominal typing?',
      answer: 'TypeScript uses structural typing: compatibility is based on the SHAPE (properties and methods) of a type, not its name or declaration. If object X has all properties required by type Y, X is assignable to Y — no "implements" needed. Most languages (Java, C#) use nominal typing where the type name/declaration matters.',
    },
    {
      question: 'What does the "satisfies" operator do?',
      answer: 'satisfies (TS 4.9+) validates that a value matches a type WITHOUT widening it. Unlike "as Type", it preserves narrow literal types while ensuring the value conforms to the type. Example: const routes = { home: "/", about: "/about" } satisfies Record<string, string> — routes.home is still the literal "/" type, not just string.',
    },
    {
      question: 'How do custom type predicates work?',
      answer: 'A type predicate is a return type annotation of the form "paramName is Type". When the function returns true, TypeScript narrows the parameter to that type in the calling code. Example: function isString(x: unknown): x is string { return typeof x === "string"; } — after if (isString(val)), val is typed as string.',
    },
    {
      question: 'What is declaration merging and when does it happen?',
      answer: 'Declaration merging occurs when multiple declarations with the same name are automatically combined. It works with interfaces (properties are merged), namespaces (combined into one), and namespace + class/function (augmenting). Type aliases do NOT support merging — redeclaring a type is an error. This is useful for extending third-party types.',
    },
    {
      question: 'How does the "infer" keyword work in conditional types?',
      answer: 'infer declares a type variable within a conditional type that TS infers from the matched pattern. Example: type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never — if T is a function, R is inferred as its return type. It\'s how built-in utility types like ReturnType, Parameters, and Awaited are implemented.',
    },
    {
      question: 'What are mapped types and how do they work?',
      answer: 'Mapped types transform each property of an existing type: type Readonly<T> = { readonly [K in keyof T]: T[K] }. "keyof T" gives the union of property names, "[K in ...]" iterates over them, and you can modify modifiers (readonly, optional with + or -). Partial, Required, Readonly, and Record are all mapped types.',
    },
    {
      question: 'What is the difference between "as const" and a regular const declaration?',
      answer: '"const x = [1, 2, 3]" gives type number[]. "const x = [1, 2, 3] as const" gives type readonly [1, 2, 3] — a readonly tuple with literal types. as const makes the entire value deeply readonly and preserves all literal types. Useful for creating type-safe enums, configuration objects, and exhaustive arrays.',
    },
  ],
  codeExamples: [
    {
      title: 'Generic Utility Function & Constraints',
      language: 'typescript',
      code: `// Generic API wrapper with type-safe responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
  }
  const data: T = await response.json();
  return { data, status: response.status, message: 'Success' };
}

// Usage — type is inferred from the generic parameter
interface User { id: number; name: string; email: string; }
const result = await fetchApi<User>('/api/user/1');
result.data.name; // TS knows this is string

// --- Generic constraints ---
interface HasId { id: string | number; }

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id);
}

// T is inferred as the array element type, constrained to have 'id'
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const user = findById(users, 1); // type: { id: number; name: string } | undefined

// --- Generic with defaults ---
interface PaginatedResult<T, M = Record<string, unknown>> {
  items: T[];
  total: number;
  page: number;
  meta: M; // defaults to Record<string, unknown>
}`,
      explanation: 'Generics preserve type information through function calls. Constraints (extends) restrict what types are valid. Default type parameters provide fallbacks. T["id"] is an indexed access type — it extracts the type of the id property from T.',
    },
    {
      title: 'Discriminated Unions & Exhaustive Checking',
      language: 'typescript',
      code: `// Result type — "either success or error, never both"
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { ok: false, error: 'Division by zero' };
  return { ok: true, value: a / b };
}

const result = divide(10, 3);
if (result.ok) {
  result.value; // TS knows: number (not error)
} else {
  result.error; // TS knows: string (not value)
}

// --- Exhaustive switch with never ---
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // If we forget a case, this line errors at compile time!
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// --- as const for type-safe enums ---
const DIRECTIONS = ['north', 'south', 'east', 'west'] as const;
type Direction = (typeof DIRECTIONS)[number]; // "north" | "south" | "east" | "west"

function move(dir: Direction) { /* TS enforces only valid directions */ }
move('north'); // OK
// move('up'); // Error: '"up"' is not assignable to type Direction`,
      explanation: 'Discriminated unions enable exhaustive type checking. The never type in the default case catches unhandled variants at compile time — if you add a new Shape kind, the code won\'t compile until you handle it. "as const" creates readonly literal types from values.',
    },
    {
      title: 'Utility Types & Mapped Types',
      language: 'typescript',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Built-in utility types
type PublicUser = Omit<User, 'password'>;            // Remove password
type UserPreview = Pick<User, 'id' | 'name'>;        // Only id and name
type UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>>; // Optional fields, no id/createdAt
type ReadonlyUser = Readonly<User>;                   // All fields readonly

// Record: create object type from key-value types
type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>;
const perms: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

// --- Custom mapped types ---
// Make specific properties required, rest stays the same
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
type UserWithEmail = RequireFields<Partial<User>, 'email'>; // email required, rest optional

// Deep readonly (recursive)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Extract function parameter types
type Fn = (name: string, age: number) => boolean;
type Params = Parameters<Fn>;    // [string, number]
type Return = ReturnType<Fn>;    // boolean
type First = Parameters<Fn>[0];  // string

// Template literal types
type EventName = \`on\$\{Capitalize<'click' | 'focus' | 'blur'>\}\`;
// "onClick" | "onFocus" | "onBlur"`,
      explanation: 'Utility types transform existing types without redefining them. Mapped types iterate over keys with [K in keyof T]. Conditional types (extends ? :) enable type-level programming. Template literal types combine string manipulation with the type system.',
    },
  ],
};
