<?php
declare(strict_types=1);

// Step 4: Functions and closures - typed params, named/variadic args, use-by-value vs by-ref
// - Typed parameters and return types are enforced under strict_types: pass an int where a
//   string is declared and you get a TypeError, not silent coercion.
// - Named arguments let callers skip optional params by name instead of positional order.
// - Closures capture outer variables by VALUE by default via use($x); use(&$x) captures by
//   reference, so later changes to the outer variable are visible inside the closure.
// - Arrow functions (fn() => ...) auto-capture every outer variable by value automatically -
//   no use() needed, but you also can't capture by reference with them.
// - First-class callable syntax strlen(...) turns any function/method into a Closure value.

function greet(string $name, string $greeting = "Hello"): string {
    return "{$greeting}, {$name}!";
}
echo greet("Nova") . "\n";
echo greet(name: "Zoe", greeting: "Hi") . "\n";  // named args, any order
echo greet(greeting: "Yo", name: "Sam") . "\n";

// variadics - collects remaining args into an array
function sumAll(int ...$nums): int {
    return array_sum($nums);
}
echo "sumAll: " . sumAll(1, 2, 3, 4) . "\n";

// union and nullable types
function describe(int|string $value): string {
    return is_int($value) ? "int:{$value}" : "string:{$value}";
}
function findUser(?int $id): string {
    return $id === null ? "no id given" : "user #{$id}";
}
echo describe(5) . " / " . describe("five") . "\n";
echo findUser(null) . " / " . findUser(42) . "\n";

// --- closures: use() by value vs by reference ---
$counter = 0;
$incByValue = function () use ($counter) {
    $counter++; // modifies the closure's own copy, not the outer $counter
    return $counter;
};
$incByRef = function () use (&$counter) {
    $counter++; // modifies the outer $counter directly
    return $counter;
};
$incByValue();
$incByValue();
echo "after 2 by-value calls, outer counter: {$counter}\n"; // still 0
$incByRef();
$incByRef();
echo "after 2 by-ref calls, outer counter: {$counter}\n";   // now 2

// arrow fn: auto-captures $counter by value at call time, no use() needed
$showCounter = fn() => "counter is now {$counter}";
echo $showCounter() . "\n";

// first-class callable syntax
$len = strlen(...);
echo "first-class callable: " . $len("hello") . "\n";

// Interview notes:
// - use($x) snapshots the value at closure-creation time; use(&$x) shares the same variable.
// - Mixing named args with positional args: positional must come first.
// - strict_types + union types is the modern way to accept "int or string" without losing
//   type safety compared to old untyped code.
