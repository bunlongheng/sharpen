// Step 1: Hello World - basics, types, string interpolation
// - Console.WriteLine is the go-to for stdout; top-level statements let a file start executing
//   immediately with no explicit Main method or namespace boilerplate (C# 9+).
// - var infers the compile-time type from the right-hand side; it is still statically typed,
//   just written without the type name - not the same as dynamic or duck typing.
// - Composite formatting inside {} supports alignment ({x,8}) and format strings ({x:F2}) -
//   interviewers use this to check you know interpolation is more than just glue-stringing.
// - Verbatim strings (@"...") ignore escape sequences; raw string literals ("""...""") (C# 11+)
//   handle multi-line text and embedded quotes without any escaping at all.
// - Implicit conversions only widen (int -> long -> double); narrowing needs an explicit cast
//   and can lose data silently if you are not careful.

Console.WriteLine("Hello, Brush Up!");

// --- var vs explicit types ---
var inferredName = "Ada";          // compiler infers string
string explicitName = "Grace";     // explicit type, same result
int age = 36;
Console.WriteLine($"var: {inferredName} ({inferredName.GetType().Name}), explicit: {explicitName}");

// --- string interpolation with format specifiers ---
double price = 19.5;
Console.WriteLine($"price with 2 decimals: {price:F2}");
Console.WriteLine($"right-aligned in 8 chars: [{age,8}]");
Console.WriteLine($"combined: [{price,8:F2}]");

// --- verbatim and raw strings ---
string path = @"C:\Users\ada\notes.txt";  // no need to escape backslashes
Console.WriteLine($"verbatim path: {path}");

string raw = """
    Raw strings preserve "quotes" and
    multiple lines without escaping.
    """;
Console.WriteLine(raw);

// --- implicit vs explicit conversions ---
int wholeNumber = 42;
double widened = wholeNumber;           // implicit: int -> double, always safe
double preciseValue = 3.99;
int narrowed = (int)preciseValue;       // explicit cast required, truncates (not rounds!)
Console.WriteLine($"implicit widen: {widened}, explicit narrow (truncated): {narrowed}");

// Interview notes:
// - var is resolved at compile time, so `var x = 5;` is exactly `int x = 5;` under the hood.
// - Common mistake: assuming (int)3.99 rounds to 4; it truncates to 3. Use Math.Round for rounding.
// - {value,width} pads/aligns; a negative width left-aligns instead of right-aligns.
