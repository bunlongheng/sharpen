import {
  Hand,
  Layers,
  GitBranch,
  FunctionSquare,
  Building2,
  ShieldAlert,
  Repeat,
  Tags,
  Sparkles,
  Hourglass,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// Python cannot run in the browser without a multi-MB runtime, so each lesson ships the real
// source plus the stdout RECORDED from `python3 <file>` (npm run record:lessons).
const raw = import.meta.glob('./*.py', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const PY_STEPS: CodeStep[] = recordedSteps('python', raw, outs, '.py', [
  [1, 'Hello World', Hand, 'print, variables, f-strings, dynamic typing', '01_hello_world.py'],
  [2, 'Collections', Layers, 'list, tuple, dict, set, copies', '02_collections.py'],
  [3, 'Control Flow', GitBranch, 'truthiness, loops, comprehensions, match', '03_control_flow.py'],
  [4, 'Functions', FunctionSquare, '*args, **kwargs, closures, recursion', '04_functions.py'],
  [5, 'Classes & Dataclasses', Building2, 'properties, inheritance, dataclass', '05_classes.py'],
  [6, 'Errors & Context Managers', ShieldAlert, 'try/except/else/finally, with', '06_errors_context.py'],
  [7, 'Iterators & Generators', Repeat, 'yield, laziness, itertools', '07_iterators_generators.py'],
  [8, 'Type Hints', Tags, 'Optional, TypedDict, Protocol, generics', '08_type_hints.py'],
  [9, 'Decorators & functools', Sparkles, 'wraps, lru_cache, partial, reduce', '09_decorators_functools.py'],
  [10, 'Async', Hourglass, 'coroutines, gather, tasks, semaphores', '10_async.py'],
])
