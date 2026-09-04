import {
  Hand,
  Brackets,
  Building2,
  Package,
  Puzzle,
  Wand2,
  Layers,
  GitMerge,
  ShieldAlert,
  ArrowRightLeft,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// C++ cannot run in the browser, so each lesson ships its source plus stdout RECORDED from a
// `clang++ -std=c++20 -Wall -Wextra -O2` build (npm run record:lessons).
const raw = import.meta.glob('./*.cpp', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const CPP_STEPS: CodeStep[] = recordedSteps('cpp', raw, outs, '.cpp', [
  [1, 'Hello World', Hand, 'iostream, auto, references, constexpr', '01_hello_world.cpp'],
  [2, 'Strings & Vectors', Brackets, 'std::string, vector, iterators', '02_strings_vectors.cpp'],
  [3, 'Classes & RAII', Building2, 'ctor/dtor order, RAII, rule of 5', '03_classes_raii.cpp'],
  [4, 'Smart Pointers', Package, 'unique_ptr, shared_ptr, weak_ptr', '04_smart_pointers.cpp'],
  [5, 'Templates & Concepts', Puzzle, 'templates, deduction, C++20 concepts', '05_templates_concepts.cpp'],
  [6, 'STL Algorithms', Wand2, 'sort, find_if, accumulate, erase_if', '06_stl_algorithms.cpp'],
  [7, 'Maps & Sets', Layers, 'map vs unordered_map, structured bindings', '07_maps_sets.cpp'],
  [
    8,
    'Inheritance & Polymorphism',
    GitMerge,
    'virtual, override, slicing',
    '08_inheritance_polymorphism.cpp',
  ],
  [
    9,
    'Exceptions, optional, variant',
    ShieldAlert,
    'try/catch, noexcept, visit',
    '09_exceptions_optional_variant.cpp',
  ],
  [10, 'Move Semantics', ArrowRightLeft, 'rvalues, std::move, forwarding', '10_move_semantics.cpp'],
])
