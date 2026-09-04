// Step 3: Control Flow - if/switch, pattern matching, loops, null checks
// - Switch expressions (C# 8+) return a value and require exhaustiveness (or a discard `_`);
//   switch statements are older, execute code blocks, and need explicit break.
// - Pattern matching goes beyond type checks: property patterns, relational patterns (>, <=),
//   and list patterns ([first, .., last]) let you express intent without nested ifs.
// - `is null` / `is not null` are preferred over `== null` because they cannot be fooled by a
//   misbehaving == operator overload - a subtle interview gotcha.
// - foreach works over anything implementing IEnumerable<T>; while is for condition-driven loops
//   where the iteration count is not known up front.

// --- if / switch statement ---
int score = 85;
if (score >= 90) Console.WriteLine("if: grade A");
else if (score >= 80) Console.WriteLine("if: grade B");
else Console.WriteLine("if: grade C or below");

switch (score / 10)
{
    case 9: Console.WriteLine("switch statement: A range"); break;
    case 8: Console.WriteLine("switch statement: B range"); break;
    default: Console.WriteLine("switch statement: below B"); break;
}

// --- switch expression ---
string grade = score switch { >= 90 => "A", >= 80 => "B", >= 70 => "C", _ => "F" };
Console.WriteLine($"switch expression grade: {grade}");

// --- pattern matching: type, property, relational, list ---
object shape = "circle";
string kind = shape switch
{
    string s => $"type pattern: string with length {s.Length}",
    int => "type pattern: int",
    _ => "unknown"
};
Console.WriteLine(kind);

var point = new { X = 0, Y = 5 };
string axis = point switch
{
    { X: 0, Y: 0 } => "property pattern: origin",
    { X: 0 } => "property pattern: on Y axis",
    _ => "property pattern: elsewhere"
};
Console.WriteLine(axis);

int temperature = 15;
string comfort = temperature switch { < 0 => "relational: freezing", < 25 => "relational: mild", _ => "relational: hot" };
Console.WriteLine(comfort);

int[] sequence = { 1, 2, 3, 4, 5 };
string listDescription = sequence switch
{
    [] => "list pattern: empty",
    [var single] => $"list pattern: single {single}",
    [var first, .., var last] => $"list pattern: first={first}, last={last}"
};
Console.WriteLine(listDescription);

// --- foreach and while ---
foreach (int n in sequence)
    Console.Write($"{n} ");
Console.WriteLine();

int countdown = 3;
while (countdown > 0)
{
    Console.WriteLine($"while countdown: {countdown}");
    countdown--;
}

// --- ternary and null checks ---
string? maybeName = null;
Console.WriteLine(maybeName is null ? "ternary: (no name)" : maybeName);
maybeName = "Rae";
Console.WriteLine(maybeName is not null ? $"is not null: {maybeName}" : "still null");

// Interview notes:
// - Common mistake: forgetting `break` in a switch statement; C# blocks implicit fall-through
//   from a non-empty case at compile time, unlike C or Java, but stacked empty case labels still
//   fall through to the next block below them.
// - Switch expressions must be exhaustive; the compiler warns when a value is not covered and
//   there is no discard `_` to catch the rest.
