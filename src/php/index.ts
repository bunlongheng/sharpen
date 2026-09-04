import {
  Hand,
  Layers,
  Type,
  FunctionSquare,
  Building2,
  GitMerge,
  ShieldAlert,
  Repeat,
  CircleSlash,
  Braces,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// PHP cannot run in the browser, so each lesson ships its source plus stdout RECORDED from
// `php <file>` (npm run record:lessons).
const raw = import.meta.glob('./*.php', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const PHP_STEPS: CodeStep[] = recordedSteps('php', raw, outs, '.php', [
  [1, 'Hello World', Hand, 'echo, interpolation, heredoc, strict_types', '01_hello_world.php'],
  [2, 'Arrays', Layers, 'indexed vs assoc, array_map/filter, spread', '02_arrays.php'],
  [3, 'Strings & Types', Type, 'type juggling, === , string functions', '03_strings_types.php'],
  [
    4,
    'Functions & Closures',
    FunctionSquare,
    'typed params, named args, use, fn',
    '04_functions_closures.php',
  ],
  [5, 'Classes', Building2, 'promotion, readonly, interfaces, enums', '05_classes.php'],
  [6, 'Inheritance & Traits', GitMerge, 'abstract, traits, late static binding', '06_inheritance_traits.php'],
  [7, 'Exceptions', ShieldAlert, 'try/catch/finally, custom, previous', '07_exceptions.php'],
  [8, 'Generators & Iterators', Repeat, 'yield, yield from, Iterator', '08_generators_iterators.php'],
  [
    9,
    'Null Safety & Modern PHP',
    CircleSlash,
    '??, ?->, named args, readonly classes',
    '09_null_safety_modern.php',
  ],
  [10, 'JSON & Regex', Braces, 'json_encode/decode, preg_*', '10_json_regex.php'],
])
