import {
  Hand,
  ArrowRightLeft,
  Boxes,
  Layers,
  ShieldAlert,
  Puzzle,
  Link,
  Repeat,
  Package,
  Cpu,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// Rust cannot run in the browser here, so each lesson ships its source plus stdout RECORDED
// from `rustc -O <file> && ./<bin>` (npm run record:lessons).
const raw = import.meta.glob('./*.rs', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const RUST_STEPS: CodeStep[] = recordedSteps('rust', raw, outs, '.rs', [
  [1, 'Hello World', Hand, 'println!, let/mut, shadowing, tuples', '01_hello_world.rs'],
  [
    2,
    'Ownership & Borrowing',
    ArrowRightLeft,
    'moves, clone, & vs &mut, slices',
    '02_ownership_borrowing.rs',
  ],
  [3, 'Structs & Enums', Boxes, 'impl, derive, match, Option', '03_structs_enums.rs'],
  [4, 'Collections', Layers, 'Vec, String vs &str, HashMap entry', '04_collections.rs'],
  [5, 'Error Handling', ShieldAlert, 'Result, ?, custom errors', '05_error_handling.rs'],
  [6, 'Traits & Generics', Puzzle, 'trait bounds, impl Trait, dyn Trait', '06_traits_generics.rs'],
  [7, 'Lifetimes', Link, "why 'a exists, elision, 'static", '07_lifetimes.rs'],
  [8, 'Iterators & Closures', Repeat, 'Fn traits, map/filter/collect, fold', '08_iterators_closures.rs'],
  [9, 'Smart Pointers', Package, 'Box, Rc, RefCell, Drop', '09_smart_pointers.rs'],
  [10, 'Concurrency', Cpu, 'threads, Arc<Mutex>, channels', '10_concurrency.rs'],
])
