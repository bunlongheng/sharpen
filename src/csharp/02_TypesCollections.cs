// Step 2: Types & Collections - value vs reference, arrays, List, Dictionary, HashSet, records, tuples
// - Structs are value types: assigning or passing one copies the data. Classes are reference
//   types: assigning or passing one copies the reference, so both variables see the same object.
// - Arrays are fixed-size; List<T> is the resizable go-to for most day-to-day collection work.
// - Dictionary<K,V>.TryGetValue avoids a double lookup and avoids throwing on a missing key.
// - HashSet<T> guarantees no duplicates and O(1) average Contains, unlike a List<T>.Contains
//   which is O(n).
// - Records give you value equality and immutability-by-default for free, plus with-expressions
//   for non-destructive updates.

// --- value vs reference semantics ---
var s1 = new PointStruct { X = 1, Y = 1 };
var s2 = s1;          // copies the struct's data
s2.X = 99;
Console.WriteLine($"struct copy: s1.X={s1.X}, s2.X={s2.X}");  // s1 unaffected

var c1 = new PointClass { X = 1, Y = 1 };
var c2 = c1;           // copies the reference, both point at the same object
c2.X = 99;
Console.WriteLine($"class ref: c1.X={c1.X}, c2.X={c2.X}");    // c1 also changed

// --- arrays and List<T> ---
int[] fixedNums = { 1, 2, 3 };
List<int> nums = new() { 1, 2, 3 };
nums.Add(4);
Console.WriteLine($"array (fixed size {fixedNums.Length}): [{string.Join(", ", fixedNums)}]");
Console.WriteLine($"List after Add: [{string.Join(", ", nums)}]");

// --- Dictionary<K,V> with TryGetValue ---
var ages = new Dictionary<string, int> { ["Alice"] = 30, ["Bob"] = 25 };
if (ages.TryGetValue("Alice", out int aliceAge))
    Console.WriteLine($"TryGetValue found Alice: {aliceAge}");
if (!ages.TryGetValue("Carol", out int carolAge))
    Console.WriteLine($"TryGetValue missing key returns default: {carolAge}");

// --- HashSet<T> ---
var uniqueIds = new HashSet<int> { 1, 2, 2, 3, 3, 3 };
Console.WriteLine($"HashSet deduped: [{string.Join(", ", uniqueIds.OrderBy(x => x))}], contains 2: {uniqueIds.Contains(2)}");

// --- records: value equality and with-expressions ---
var p1 = new PersonRecord("Nova", 20);
var p2 = new PersonRecord("Nova", 20);
var p3 = p1 with { Age = 21 };  // non-destructive update, p1 stays unchanged
Console.WriteLine($"record value equality: p1 == p2 -> {p1 == p2}");
Console.WriteLine($"with-expression: p1={p1}, p3={p3}");

// --- tuples ---
(string Name, int Age) tuple = ("Zoe", 28);
var (name, tupleAge) = tuple;  // deconstruction
Console.WriteLine($"tuple: {tuple}, deconstructed name={name}, age={tupleAge}");

struct PointStruct { public int X, Y; }
class PointClass { public int X, Y; }
record PersonRecord(string Name, int Age);

// Interview notes:
// - Common mistake: assuming a struct assigned into a class field also copies; boxing a struct
//   into an object DOES copy, but storing it in a class field just stores the value inline (fine).
// - Records use structural equality by default; classes use reference equality unless overridden.
// - HashSet<T> has no guaranteed enumeration order - never rely on insertion order when printing.
