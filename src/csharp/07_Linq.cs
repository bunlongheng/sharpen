// Step 7: LINQ - Where/Select/OrderBy/GroupBy/Aggregate, deferred execution, query syntax
// - Most LINQ operators (Where, Select, OrderBy, GroupBy) are deferred: the query is only a
//   description of work until something enumerates it (foreach, ToList, Count, and so on).
// - Any/First/FirstOrDefault check or grab an element without a manual loop; First throws on no
//   match, FirstOrDefault returns default(T) - a common source of a missed null check later.
// - Method syntax (.Where(...).Select(...)) and query syntax (from x in ... where ... select ...)
//   compile to the same thing; method syntax is far more common in real codebases.
// - ToList forces immediate execution and snapshots the results at that point in time.

List<int> numbers = new() { 5, 3, 8, 1, 9, 2 };

// --- Where / Select / OrderBy (method syntax) ---
var evensSquared = numbers.Where(n => n % 2 == 0).Select(n => n * n).OrderBy(n => n);
Console.WriteLine($"Where+Select+OrderBy: [{string.Join(", ", evensSquared)}]");

// --- query syntax (equivalent to the above) ---
var oddDescending = from n in numbers
                     where n % 2 != 0
                     orderby n descending
                     select n;
Console.WriteLine($"query syntax (odd, descending): [{string.Join(", ", oddDescending)}]");

// --- GroupBy ---
var grouped = numbers.GroupBy(n => n % 2 == 0 ? "even" : "odd")
                      .OrderBy(g => g.Key);  // order groups for deterministic output
foreach (var group in grouped)
    Console.WriteLine($"GroupBy [{group.Key}]: [{string.Join(", ", group)}]");

// --- Aggregate ---
int product = numbers.Aggregate(1, (acc, n) => acc * n);
Console.WriteLine($"Aggregate product of all: {product}");

// --- Any, First vs FirstOrDefault ---
Console.WriteLine($"Any > 8: {numbers.Any(n => n > 8)}");
Console.WriteLine($"First > 8: {numbers.First(n => n > 8)}");
Console.WriteLine($"FirstOrDefault > 100 (no match): {numbers.FirstOrDefault(n => n > 100)}");
// numbers.First(n => n > 100);  // <- would throw InvalidOperationException: no matching element

// --- deferred execution ---
List<string> names = new() { "Ada", "Grace" };
var deferredQuery = names.Where(n => n.StartsWith("A"));  // not run yet, just describes the work
names.Add("Alan");  // mutate the source AFTER building the query, BEFORE enumerating it
var deferredResult = deferredQuery.ToList();  // enumeration happens here, ToList forces it now
Console.WriteLine($"deferred execution picked up late addition: [{string.Join(", ", deferredResult)}]");

// Interview notes:
// - Common mistake: assuming a LINQ query runs the moment it is written; it actually runs lazily
//   every time it is enumerated, which can re-run expensive work or see a mutated source.
// - ToList/ToArray/Count()/First force immediate execution; without one of those, the query is
//   just a pipeline definition, not a result.
