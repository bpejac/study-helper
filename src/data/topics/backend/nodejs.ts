import { Topic } from '@/types';

export const nodejs: Topic = {
  id: 'nodejs',
  title: 'Node.js',
  description: 'JavaScript runtime built on Chrome\'s V8 engine for server-side development',
  category: 'backend',
  confidence: 'advanced',
  keyPoints: [
    {
      title: 'Event-Driven Architecture',
      description: 'Node.js uses a **single-threaded event loop** with **non-blocking I/O** to handle thousands of concurrent connections efficiently. Under the hood, **libuv** manages an OS-level thread pool (default 4 threads) for operations that can\'t be made non-blocking (file I/O, DNS lookups, crypto). The event loop has **phases**: timers → pending callbacks → idle/prepare → **poll** (I/O) → check (`setImmediate`) → close callbacks. **Microtasks** (Promise callbacks, `process.nextTick`) run between each phase. This architecture makes Node excellent for **I/O-bound** workloads (APIs, real-time apps) but poor for **CPU-bound** tasks (image processing, ML) unless offloaded to `worker_threads`.',
    },
    {
      title: 'NPM Ecosystem',
      description: 'The **Node Package Manager** is the world\'s largest software registry with 2M+ packages. Key concepts: `package.json` defines project metadata, scripts, and dependency ranges (using **semver**: `^1.2.3` = compatible, `~1.2.3` = patch-level). `package-lock.json` pins **exact versions** (including transitive deps) for reproducible builds. **devDependencies** vs **dependencies**: dev deps (testing, linting) aren\'t installed in production. `npx` runs packages without global install. Workspaces enable **monorepo** management. Security: `npm audit` scans for known vulnerabilities. Alternatives: **yarn** (deterministic installs, offline cache), **pnpm** (symlinked packages, saves disk space).',
    },
    {
      title: 'Streams',
      description: 'Streams process data **piece by piece** (chunks) rather than loading everything into memory, essential for handling large files or continuous data. Four types:\n\n- **Readable**: source of data (`fs.createReadStream`, `http.IncomingMessage`)\n- **Writable**: destination (`fs.createWriteStream`, `http.ServerResponse`)\n- **Duplex**: both readable and writable (`net.Socket`, `WebSocket`)\n- **Transform**: modifies data passing through (`zlib.createGzip`, `crypto.createCipher`)\n\nStreams use **backpressure** to prevent a fast producer from overwhelming a slow consumer — `pipe()` and `pipeline()` handle this automatically. Always use `pipeline()` (from `stream/promises`) over `.pipe()` for proper error handling and cleanup. Streams implement the **iterator protocol**, so you can use `for await...of` to consume them.',
    },
    {
      title: 'Module System',
      description: 'Node supports two module systems: **CommonJS** (CJS) and **ES Modules** (ESM). CJS uses `require()` and `module.exports` — it\'s **synchronous**, **dynamic** (can require conditionally), and wraps each file in a function `(function(exports, require, module, __filename, __dirname) { ... })`. ESM uses `import`/`export` — it\'s **statically analyzable** (enables tree-shaking), supports **top-level await**, and uses `import.meta.url` instead of `__filename`. Toggle ESM with `"type": "module"` in package.json or `.mjs` extension. CJS files in ESM projects use `.cjs`. Key gotcha: ESM can `import` CJS modules, but CJS **cannot** `require()` ESM modules (use dynamic `import()` instead).',
    },
    {
      title: 'Built-in Modules',
      description: 'Node provides essential modules without npm installs:\n\n- **`fs`/`fs/promises`**: file system operations (read, write, watch, stat). Always prefer the `promises` API over callbacks.\n- **`path`**: cross-platform path manipulation (`join`, `resolve`, `basename`, `extname`). Never concatenate paths with strings.\n- **`http`/`https`**: create servers and make requests. Low-level — frameworks like Express add routing and middleware.\n- **`crypto`**: hashing (`createHash`), encryption (`createCipheriv`), random bytes (`randomBytes`), and `scrypt` for password hashing.\n- **`events`**: `EventEmitter` class — the backbone of Node\'s event-driven architecture.\n- **`child_process`**: spawn subprocesses (`exec`, `spawn`, `fork`). `fork()` creates a new V8 instance with IPC channel.\n- **`worker_threads`**: true parallelism for CPU-intensive tasks, sharing memory via `SharedArrayBuffer`.\n- **`cluster`**: fork multiple processes to utilize all CPU cores, with built-in load balancing.',
    },
    {
      title: 'Error Handling Patterns',
      description: 'Node has distinct error handling patterns for different contexts:\n\n- **Synchronous**: standard `try/catch` blocks\n- **Callbacks**: error-first pattern `(err, result) => {}` — always check `err` first\n- **Promises**: `.catch()` or `try/catch` with `async/await`\n- **EventEmitters**: listen for `\'error\'` events — **unhandled error events crash the process**\n- **Streams**: `pipeline()` propagates errors from any stream in the chain\n\n**`process.on(\'uncaughtException\')`** catches unhandled sync/callback errors but the process state may be corrupt — log and exit. **`process.on(\'unhandledRejection\')`** catches unhandled Promise rejections (will crash in future Node versions). Use **operational errors** (expected, handle gracefully) vs **programmer errors** (bugs, crash and restart).',
    },
  ],
  quizQuestions: [
    {
      question: 'Why is Node.js single-threaded but still efficient for I/O operations?',
      answer: 'Node uses non-blocking I/O and an event loop. I/O operations are delegated to the system kernel or libuv\'s thread pool, and callbacks are queued when complete. This allows one thread to handle thousands of concurrent connections without the overhead of thread context switching.',
    },
    {
      question: 'What is the difference between require() and import?',
      answer: 'require() is CommonJS (synchronous, dynamic, can be conditional). import is ES Modules (statically analyzable for tree-shaking, supports top-level await). ESM can import CJS, but CJS cannot require() ESM — use dynamic import() instead.',
    },
    {
      question: 'When should you use Streams instead of reading entire files?',
      answer: 'Use streams for large files or continuous data to avoid loading everything into memory at once. Streams process data in chunks, enabling handling of files larger than available RAM. Also use for piping data between sources (e.g., HTTP response to file) without buffering.',
    },
    {
      question: 'What is the purpose of package-lock.json?',
      answer: 'It locks exact dependency versions (including all transitive dependencies) to ensure reproducible builds. Without it, npm install might resolve different versions over time due to semver ranges in package.json. Always commit it to version control.',
    },
    {
      question: 'What are the phases of the Node.js event loop?',
      answer: 'Timers (setTimeout/setInterval callbacks) → Pending callbacks (deferred I/O callbacks) → Idle/Prepare (internal) → Poll (retrieve new I/O events) → Check (setImmediate callbacks) → Close callbacks (e.g., socket.on("close")). Microtasks (Promises, process.nextTick) run between each phase.',
    },
    {
      question: 'What is backpressure in streams and how is it handled?',
      answer: 'Backpressure occurs when a Readable stream produces data faster than a Writable stream can consume it. If unchecked, data accumulates in memory. pipe() and pipeline() handle this automatically by pausing the readable when the writable\'s internal buffer is full.',
    },
    {
      question: 'What is the difference between process.nextTick() and setImmediate()?',
      answer: 'process.nextTick() executes before any I/O events and before the event loop continues (in the microtask queue). setImmediate() executes in the "check" phase, after I/O events are processed. Excessive nextTick() calls can starve I/O; prefer setImmediate() for deferring work.',
    },
    {
      question: 'Why should you never use synchronous fs methods in a server?',
      answer: 'Synchronous methods (readFileSync, writeFileSync) block the event loop, preventing all other requests from being processed until the operation completes. On a server handling concurrent requests, this causes all users to wait. Use fs/promises or fs callbacks instead.',
    },
    {
      question: 'What is the difference between child_process.fork() and worker_threads?',
      answer: 'fork() creates a new Node.js process with its own V8 instance and memory, communicating via JSON over IPC (good for isolating full programs). worker_threads run in the same process, share memory via SharedArrayBuffer, have lower overhead, and are better for CPU-intensive computations.',
    },
    {
      question: 'How does the cluster module help with performance?',
      answer: 'cluster.fork() creates worker processes that share the same server port, utilizing all CPU cores. The master process distributes connections among workers (round-robin on Linux, OS-dependent on other platforms). If a worker crashes, the master can fork a replacement.',
    },
    {
      question: 'What is the difference between operational errors and programmer errors in Node?',
      answer: 'Operational errors are expected failures (network timeout, file not found, invalid user input) — handle gracefully with error responses. Programmer errors are bugs (undefined property access, wrong argument type) — crash and restart with a process manager. Mixing them up leads to either instability or poor UX.',
    },
    {
      question: 'Why is pipeline() preferred over pipe() for streams?',
      answer: 'pipeline() (from stream/promises) properly propagates errors from any stream in the chain, cleans up resources on failure, and returns a promise. pipe() silently swallows errors from inner streams and doesn\'t clean up, potentially causing memory leaks.',
    },
  ],
  codeExamples: [
    {
      title: 'Express REST API with Error Handling',
      language: 'typescript',
      code: `import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

// Async route handler wrapper (avoids try/catch in every route)
const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Routes
app.get('/api/users/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await findUser(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}));

// Error handling middleware (must have 4 params)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
      explanation: 'The asyncHandler wrapper catches rejected promises and passes them to the error middleware, avoiding repetitive try/catch blocks in every route.',
    },
    {
      title: 'Stream Pipeline with Transform',
      language: 'typescript',
      code: `import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { Transform } from 'stream';

// Custom transform stream: convert to uppercase
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

async function processFile(input: string, output: string) {
  await pipeline(
    createReadStream(input),     // Readable
    upperCase,                    // Transform
    createGzip(),                // Transform (compress)
    createWriteStream(output)    // Writable
  );
  // pipeline handles backpressure and error propagation
  console.log('Processing complete');
}

// Streams as async iterators (Node 10+)
async function countLines(filePath: string): Promise<number> {
  let count = 0;
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  for await (const chunk of stream) {
    count += chunk.split('\\n').length - 1;
  }
  return count;
}`,
      explanation: 'Streams process data in chunks without loading entire files into memory. pipeline() properly handles errors and backpressure across the entire chain.',
    },
    {
      title: 'Event Loop & Async Order',
      language: 'javascript',
      code: `// Demonstrates execution order in the event loop

console.log('1. Synchronous');

setTimeout(() => console.log('2. setTimeout (macrotask)'), 0);

setImmediate(() => console.log('3. setImmediate (check phase)'));

Promise.resolve().then(() => console.log('4. Promise (microtask)'));

process.nextTick(() => console.log('5. nextTick (before microtasks)'));

console.log('6. Synchronous');

// Output order:
// 1. Synchronous
// 6. Synchronous
// 5. nextTick (before microtasks)
// 4. Promise (microtask)
// 2. setTimeout (macrotask)     ← order of 2 & 3
// 3. setImmediate (check phase) ← may vary outside I/O

// Inside an I/O callback, setImmediate always fires before setTimeout`,
      explanation: 'Understanding execution order is critical for avoiding subtle bugs. Microtasks (nextTick, Promises) always run before the next event loop phase.',
    },
  ],
};
