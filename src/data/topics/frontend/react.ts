import { Topic } from '@/types';

export const react: Topic = {
  id: 'react',
  title: 'React',
  description: 'Declarative JavaScript library for building user interfaces',
  category: 'frontend',
  confidence: 'expert',
  keyPoints: [
    {
      title: 'Component Model',
      description: 'React UIs are built from **isolated, reusable components** — each encapsulating its own markup, styles, and logic:\n\n- **Function components** are the modern standard (class components are legacy). They\'re plain functions that receive `props` and return JSX.\n- **Composition over inheritance**: nest components, pass children via `props.children`, or use **render props** / **compound components** for flexible APIs.\n- **Unidirectional data flow**: data flows **parent → child** via props. Children communicate upward via **callback props** (`onSelect`, `onChange`).\n- **JSX** is syntactic sugar for `React.createElement()` calls. It\'s compiled at build time, not runtime. Each JSX expression must have **one root element** (use `<Fragment>` / `<>` to avoid extra DOM nodes).',
    },
    {
      title: 'Hooks',
      description: 'Hooks let function components use state and side effects. **Rules of Hooks**: only call at the top level (not in loops/conditions), only call in function components or custom hooks.\n\n- **`useState(initial)`**: returns `[value, setter]`. Setter can take a value or an **updater function** `prev => prev + 1` (important when new state depends on old).\n- **`useEffect(fn, deps)`**: runs side effects after render. Empty deps `[]` = mount only. Return cleanup function for subscriptions/timers.\n- **`useContext(ctx)`**: reads nearest `<Context.Provider>` value. Re-renders on **every** context change — split contexts to avoid over-rendering.\n- **`useReducer(reducer, initial)`**: like useState for complex state logic. `dispatch({ type, payload })` is stable across renders.\n- **`useRef(initial)`**: mutable `.current` that persists across renders **without** triggering re-renders. Used for DOM refs and instance variables.\n- **`useMemo(fn, deps)`** / **`useCallback(fn, deps)`**: memoize values/functions. Only needed when passing to `memo()` children or expensive calculations.',
    },
    {
      title: 'Virtual DOM & Reconciliation',
      description: 'React\'s rendering pipeline uses a **virtual DOM** — a lightweight JavaScript tree mirroring the real DOM:\n\n1. **Render phase** (pure): React calls your component functions to produce a new virtual DOM tree\n2. **Diffing**: React compares new tree with previous tree using its **reconciliation algorithm** (O(n) heuristic, not O(n³) general tree diff)\n3. **Commit phase** (side effects): React applies only the **minimal set of changes** to the real DOM\n\nKey diffing rules:\n- Different **element types** → tear down old tree, build new (e.g., `<div>` → `<span>` replaces entirely)\n- Same type → update only changed **attributes/props**\n- **`key` prop** is critical for lists — it tells React which items are the same across re-renders. Use **stable IDs**, never array indices (breaks on reorder/delete).\n\n**React 18 / Fiber**: the reconciliation work is split into units that can be **interrupted** (concurrent rendering), allowing React to keep the UI responsive during large updates.',
    },
    {
      title: 'State Management',
      description: 'React offers multiple layers of state management, each suited to different scopes:\n\n- **Local state** (`useState` / `useReducer`): component-level state. **Lift state up** to the nearest common ancestor when siblings need to share it.\n- **Context API** (`createContext` + `useContext`): avoids **prop drilling** for widely-used values (theme, auth, locale). But causes re-renders for **all** consumers on any change — mitigate with `useMemo` on the value or **splitting contexts**.\n- **External stores** (Redux, Zustand, Jotai, Recoil): for complex global state with **selectors** (read only what you need), **middleware** (logging, persistence), and **devtools**. Zustand is lightweight; Redux Toolkit simplifies Redux with `createSlice`.\n- **Server state** (TanStack Query, SWR): specialized for API data — handles caching, revalidation, optimistic updates, pagination. Don\'t put API responses in Redux.\n- **URL state** (`useSearchParams`, `useRouter`): filters, pagination, and tabs should live in the URL for shareability and back-button support.',
    },
    {
      title: 'Performance Optimization',
      description: 'React re-renders a component **whenever its parent re-renders** (even if props didn\'t change). Optimization tools:\n\n- **`React.memo(Component)`**: skips re-render if props are **shallowly equal**. Useful for expensive child components. Pointless if props change every render (e.g., inline objects/functions).\n- **`useMemo` / `useCallback`**: stabilize references so `memo()` children actually skip. Don\'t over-use — adds complexity and memory overhead.\n- **Code splitting**: `React.lazy(() => import(\'./HeavyComponent\'))` + `<Suspense fallback={...}>` loads components on demand, reducing initial bundle size.\n- **Virtualization**: for long lists (1000+ items), use `react-window` or `@tanstack/react-virtual` — renders only visible items.\n- **`useTransition`** (React 18): marks state updates as **non-urgent**, keeping the UI responsive while rendering large updates in the background.\n- **React DevTools Profiler**: visualize which components re-render and why. Look for "flamegraph" hot spots.',
    },
    {
      title: 'Patterns & Best Practices',
      description: 'Common React patterns for maintainable code:\n\n- **Custom hooks**: extract reusable stateful logic into `useXxx` functions (e.g., `useFetch`, `useLocalStorage`, `useDebounce`). They compose naturally.\n- **Controlled vs Uncontrolled inputs**: controlled = React state drives the value (`value` + `onChange`). Uncontrolled = DOM manages it (`ref`). Prefer controlled for validation and dynamic behavior.\n- **Error Boundaries**: class components with `componentDidCatch` / `getDerivedStateFromError` catch rendering errors in the subtree and show fallback UI. No hook equivalent yet.\n- **Compound Components**: pattern where parent and children share implicit state via Context (e.g., `<Tabs>` + `<Tab>` + `<TabPanel>`). Gives users flexible composition.\n- **Container/Presentational** (modern variant): separate **data-fetching logic** (hooks, server components) from **UI rendering** (pure components). Less about strict "containers" now, more about separation of concerns.\n- **Strict Mode** (`<React.StrictMode>`): in development, renders components **twice** to detect impure renders and missing cleanup functions.',
    },
  ],
  quizQuestions: [
    {
      question: 'Why does React use a Virtual DOM?',
      answer: 'Real DOM manipulation is slow. React maintains a virtual copy, diffs it with the previous version using an O(n) reconciliation algorithm, and only applies the minimal set of changes to the actual DOM. This batches updates and avoids costly layout thrashing.',
    },
    {
      question: 'What is the difference between useMemo and useCallback?',
      answer: 'useMemo(fn, deps) memoizes the return VALUE of fn. useCallback(fn, deps) memoizes the FUNCTION REFERENCE itself (equivalent to useMemo(() => fn, deps)). Both prevent unnecessary recalculations/recreations when dependencies haven\'t changed. Primary use case: stabilizing props passed to memo() children.',
    },
    {
      question: 'Why do we need a key prop when rendering lists?',
      answer: 'Keys tell React which items are the same across re-renders during reconciliation. Without stable keys, React can\'t efficiently track additions, removals, or reorders — it may destroy and recreate DOM elements unnecessarily, losing component state. Never use array indices as keys if the list can be reordered or filtered.',
    },
    {
      question: 'What is the useEffect cleanup function for?',
      answer: 'The cleanup function runs 1) before the effect re-runs (when dependencies change) and 2) when the component unmounts. Use it to cancel subscriptions, abort fetch requests (AbortController), clear timers, or remove event listeners. Without cleanup, you get memory leaks and stale callbacks.',
    },
    {
      question: 'What causes an infinite loop with useEffect?',
      answer: 'When useEffect modifies state that is also in its dependency array, the effect triggers itself endlessly. Example: useEffect(() => setCount(count + 1), [count]). Also: unstable dependencies like inline objects/arrays created during render cause the effect to re-run every render even if the values are the same.',
    },
    {
      question: 'What is the difference between controlled and uncontrolled components?',
      answer: 'Controlled: React state is the "single source of truth" — the input\'s value is set by state, and onChange updates state. Uncontrolled: the DOM manages the value internally, accessed via a ref. Controlled is preferred for validation and dynamic behavior; uncontrolled is simpler for simple forms or integrating with non-React code.',
    },
    {
      question: 'How does React.memo() work and when should you use it?',
      answer: 'React.memo() wraps a component and skips re-rendering if its props are shallowly equal to the previous render. Use it for components that are expensive to render and receive the same props when their parent re-renders. It\'s ineffective if props change every render (e.g., inline objects, arrow functions) — use useMemo/useCallback to stabilize those.',
    },
    {
      question: 'What is the difference between useRef and useState?',
      answer: 'Both persist values across renders, but useState triggers a re-render when updated while useRef does NOT. useRef.current is mutable and won\'t cause the component to update. Use useRef for DOM element references, storing previous values, or mutable instance variables that shouldn\'t trigger re-renders.',
    },
    {
      question: 'Why should you use an updater function with setState?',
      answer: 'When new state depends on previous state, use the updater form: setState(prev => prev + 1). React batches state updates, so reading the state variable directly may be stale. The updater function always receives the most recent state value, ensuring correctness even with batched or concurrent updates.',
    },
    {
      question: 'What is React Fiber and concurrent rendering?',
      answer: 'Fiber is React\'s reconciliation engine (React 16+). It splits rendering work into small units that can be paused, resumed, or aborted. This enables concurrent rendering (React 18+) where non-urgent updates (via useTransition/useDeferredValue) don\'t block the main thread, keeping the UI responsive during expensive renders.',
    },
    {
      question: 'What problem does Context API solve, and what is its main drawback?',
      answer: 'Context solves prop drilling — passing data through many intermediate components that don\'t need it. The main drawback: when the context value changes, ALL consumers re-render, even if they only use a portion of the value. Mitigate by splitting into multiple contexts, memoizing the value object, or using external state libraries with selectors.',
    },
    {
      question: 'What are Error Boundaries and why can\'t they be function components?',
      answer: 'Error Boundaries are components that catch JavaScript errors in their child component tree, log them, and show fallback UI. They use componentDidCatch and getDerivedStateFromError lifecycle methods, which only exist in class components — there\'s no hook equivalent. They don\'t catch errors in event handlers, async code, or server-side rendering.',
    },
  ],
  codeExamples: [
    {
      title: 'Custom Hook for Data Fetching',
      language: 'typescript',
      code: `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { 
          signal: controller.signal 
        });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    // Cleanup: abort in-flight request if url changes or unmount
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(
    \`/api/users/\${userId}\`
  );
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{data?.name}</div>;
}`,
      explanation: 'Custom hooks extract reusable stateful logic. The AbortController cleanup prevents setting state on unmounted components and cancels stale requests when the URL changes.',
    },
    {
      title: 'Performance: memo, useMemo, useCallback',
      language: 'typescript',
      code: `import { memo, useState, useMemo, useCallback } from 'react';

interface Item { id: number; name: string; price: number; }

// memo(): skip re-render if props unchanged (shallow compare)
const ListItem = memo(function ListItem({ 
  item, 
  onSelect 
}: { 
  item: Item; 
  onSelect: (id: number) => void;
}) {
  console.log(\`Rendering: \${item.name}\`); // only when this item's props change
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name} — \${item.price}
    </li>
  );
});

function ProductList({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  // useMemo: recompute only when items or filter change
  const filteredItems = useMemo(() => 
    items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  const total = useMemo(() => 
    filteredItems.reduce((sum, i) => sum + i.price, 0),
    [filteredItems]
  );

  // useCallback: stable function reference for memo() children
  const handleSelect = useCallback((id: number) => {
    setSelected(id);
  }, []); // no dependencies → same reference every render

  return (
    <div>
      <input 
        value={filter} 
        onChange={e => setFilter(e.target.value)} 
        placeholder="Filter..."
      />
      <p>Total: \${total} | Selected: {selected}</p>
      <ul>
        {filteredItems.map(item => (
          <ListItem 
            key={item.id} 
            item={item} 
            onSelect={handleSelect} // stable ref → memo works
          />
        ))}
      </ul>
    </div>
  );
}`,
      explanation: 'memo() wraps the child component, useMemo() stabilizes the computed value, and useCallback() stabilizes the function reference. Together they prevent unnecessary re-renders when the parent re-renders (e.g., typing in the filter input).',
    },
    {
      title: 'useReducer for Complex State',
      language: 'typescript',
      code: `import { useReducer } from 'react';

// Define state shape and actions
interface TodoState {
  todos: { id: number; text: string; done: boolean }[];
  filter: 'all' | 'active' | 'completed';
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'SET_FILTER'; filter: TodoState['filter'] };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos, { 
          id: Date.now(), text: action.text, done: false 
        }],
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      };
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
  });

  const visibleTodos = state.todos.filter(t => {
    if (state.filter === 'active') return !t.done;
    if (state.filter === 'completed') return t.done;
    return true;
  });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', text: 'New todo' })}>
        Add
      </button>
      {visibleTodos.map(todo => (
        <div key={todo.id}>
          <span 
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            onClick={() => dispatch({ type: 'TOGGLE', id: todo.id })}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}`,
      explanation: 'useReducer centralizes complex state transitions into a pure reducer function. Actions are typed discriminated unions for type safety. The dispatch function is stable across renders (unlike setState closures), making it safe to pass to children without useCallback.',
    },
  ],
};
