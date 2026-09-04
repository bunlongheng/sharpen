import {
  Hand,
  GitBranch,
  FunctionSquare,
  MousePointer2,
  Brackets,
  Boxes,
  MemoryStick,
  Cable,
  Binary,
  Hash,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// C cannot run in the browser, so each lesson ships its source plus stdout RECORDED from a
// `clang -std=c17 -Wall -Wextra -O2` build (npm run record:lessons).
const raw = import.meta.glob('./*.c', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const C_STEPS: CodeStep[] = recordedSteps('c', raw, outs, '.c', [
  [1, 'Hello World', Hand, 'printf formats, types, sizeof', '01_hello_world.c'],
  [2, 'Control Flow', GitBranch, 'switch fallthrough, loops, ternary', '02_control_flow.c'],
  [3, 'Functions', FunctionSquare, 'prototypes, by value vs pointer, recursion', '03_functions.c'],
  [4, 'Pointers', MousePointer2, 'address, deref, arithmetic, const', '04_pointers.c'],
  [5, 'Arrays & Strings', Brackets, 'decay, NUL terminator, safe copies', '05_arrays_strings.c'],
  [6, 'Structs & Enums', Boxes, 'typedef, tagged union, padding', '06_structs_enums.c'],
  [7, 'Dynamic Memory', MemoryStick, 'malloc/realloc/free, ownership', '07_dynamic_memory.c'],
  [8, 'Function Pointers', Cable, 'callbacks, qsort, dispatch tables', '08_function_pointers.c'],
  [9, 'Bit Manipulation', Binary, 'masks, set/clear/test, popcount', '09_bit_manipulation.c'],
  [10, 'Preprocessor & Modules', Hash, 'macros, guards, static, assert', '10_preprocessor_modules.c'],
])
