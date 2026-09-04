import {
  Hand,
  Layers,
  GitBranch,
  FunctionSquare,
  Building2,
  GitMerge,
  Search,
  ShieldAlert,
  Puzzle,
  Hourglass,
} from 'lucide-react'
import { recordedSteps, type CodeStep } from '../codeTrack'

// C# cannot run in the browser, so each lesson ships its source plus stdout RECORDED from a
// `dotnet run -c Release` build (npm run record:lessons).
const raw = import.meta.glob('./*.cs', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const outs = import.meta.glob('./*.out.txt', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

export const CS_STEPS: CodeStep[] = recordedSteps('csharp', raw, outs, '.cs', [
  [1, 'Hello World', Hand, 'top-level statements, var, interpolation', '01_HelloWorld.cs'],
  [
    2,
    'Types & Collections',
    Layers,
    'value vs reference, List, Dictionary, records',
    '02_TypesCollections.cs',
  ],
  [3, 'Control Flow', GitBranch, 'switch expressions, pattern matching', '03_ControlFlow.cs'],
  [4, 'Methods', FunctionSquare, 'optional/named args, out/ref, extensions', '04_Methods.cs'],
  [5, 'Classes & Records', Building2, 'properties, init, records, structs', '05_ClassesRecords.cs'],
  [
    6,
    'Interfaces & Inheritance',
    GitMerge,
    'abstract, virtual/override, sealed',
    '06_InterfacesInheritance.cs',
  ],
  [7, 'LINQ', Search, 'Where/Select/GroupBy, deferred execution', '07_Linq.cs'],
  [8, 'Exceptions', ShieldAlert, 'filters, custom, using/IDisposable', '08_Exceptions.cs'],
  [9, 'Generics & Delegates', Puzzle, 'constraints, Func/Action, events', '09_GenericsDelegates.cs'],
  [10, 'Async', Hourglass, 'Task, await, WhenAll, cancellation', '10_Async.cs'],
])
