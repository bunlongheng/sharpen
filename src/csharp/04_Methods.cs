// Step 4: Methods - optional/named args, out/ref/in, params, local functions, overloads, extensions
// - Optional parameters need a default value; named arguments let callers skip positional order,
//   which is handy when a method has several optional parameters.
// - out returns an extra value; ref lets a method mutate the caller's variable in place; in
//   passes a value by reference read-only, avoiding a copy for large structs without allowing edits.
// - params lets a caller pass a comma-separated list or an array; local functions capture the
//   enclosing scope and keep helper logic private to the method that needs it.
// - Overload resolution picks the best match at compile time based on argument types and count;
//   extension methods let you add methods to a type you do not own, called as if they were members.

// --- optional and named arguments ---
void Greet(string name, string greeting = "Hello")
    => Console.WriteLine($"{greeting}, {name}!");

Greet("Ada");
Greet("Grace", "Hi");
Greet(greeting: "Welcome", name: "Zoe");  // named args, order does not matter

// --- out, ref, in ---
void Square(int input, out int result) => result = input * input;
Square(5, out int squared);
Console.WriteLine($"out parameter: 5 squared is {squared}");

void Double(ref int value) => value *= 2;
int number = 10;
Double(ref number);
Console.WriteLine($"ref mutated caller's variable: {number}");

void PrintReadOnly(in int value) => Console.WriteLine($"in parameter (read-only ref): {value}");
PrintReadOnly(number);

// --- params ---
int Sum(params int[] values)
{
    int total = 0;
    foreach (int v in values) total += v;
    return total;
}
Console.WriteLine($"params sum: {Sum(1, 2, 3, 4)}");

// --- local functions and expression-bodied members ---
int Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);

int FactorialWithHelper(int n)
{
    return Multiply(n, n <= 1 ? 1 : FactorialWithHelper(n - 1));

    int Multiply(int a, int b) => a * b;  // local function, only visible inside this method
}
Console.WriteLine($"expression-bodied Factorial(5): {Factorial(5)}");
Console.WriteLine($"local function via helper: {FactorialWithHelper(5)}");

// --- method overloading ---
// (overloading needs real methods on a type - local functions cannot be overloaded by signature)
Console.WriteLine(Describer.Describe(5));
Console.WriteLine(Describer.Describe("five"));
Console.WriteLine(Describer.Describe(5, 6));

// --- extension method ---
Console.WriteLine($"extension method: 5.IsEven()={5.IsEven()}, 6.IsEven()={6.IsEven()}");

// Interview notes:
// - Common mistake: assuming ref/out let you pass a value type by reference for free performance;
//   they change semantics (caller sees mutations), not just performance - misuse causes bugs.
// - Extension methods are static methods in a static class with `this` on the first parameter;
//   an instance method with the same signature on the real type always wins over the extension.

static class Describer
{
    public static string Describe(int x) => $"overload(int): {x}";
    public static string Describe(string x) => $"overload(string): {x}";
    public static string Describe(int x, int y) => $"overload(int,int): {x},{y}";
}

static class IntExtensions
{
    public static bool IsEven(this int value) => value % 2 == 0;
}
