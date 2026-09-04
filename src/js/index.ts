import {
  Hand,
  Layers,
  FunctionSquare,
  Braces,
  Building2,
  Crosshair,
  Hourglass,
  ListOrdered,
  Repeat,
  Lock,
} from 'lucide-react'
import { liveSteps, type CodeStep, type RunFn } from '../codeTrack'

// JavaScript runs live in the browser, like the TypeScript track: each lesson exports run(log).
const mods = import.meta.glob('./*.js') as Record<string, () => Promise<{ run: RunFn }>>
const raw = import.meta.glob('./*.js', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const JS_STEPS: CodeStep[] = liveSteps('javascript', mods, raw, [
  [1, 'Hello World', Hand, 'values, template literals, typeof, coercion', '01_hello_world.js'],
  [2, 'Arrays & Objects', Layers, 'map/filter/reduce, destructuring, spread', '02_arrays_objects.js'],
  [
    3,
    'Functions & Closures',
    FunctionSquare,
    'arrow vs function, closures, currying',
    '03_functions_closures.js',
  ],
  [4, 'Scope & Hoisting', Braces, 'var vs let, TDZ, hoisting, block scope', '04_scope_hoisting.js'],
  [
    5,
    'Prototypes & Classes',
    Building2,
    'prototype chain, class, extends, #private',
    '05_prototypes_classes.js',
  ],
  [6, 'this Binding', Crosshair, 'call/apply/bind, lost this, arrows', '06_this_binding.js'],
  [7, 'Promises & async', Hourglass, 'callbacks to await, Promise.all, errors', '07_async_promises.js'],
  [8, 'Event Loop', ListOrdered, 'microtasks vs macrotasks, ordering', '08_event_loop.js'],
  [9, 'Iterators & Generators', Repeat, 'Symbol.iterator, generators, Map/Set', '09_iterators_generators.js'],
  [
    10,
    'Immutability & Patterns',
    Lock,
    'freeze, structuredClone, debounce, memoize',
    '10_immutability_patterns.js',
  ],
])
