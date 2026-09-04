<?php
declare(strict_types=1);

// Step 3: Strings and type juggling - == vs ===, string functions, numeric pitfalls
// - == compares after type coercion ("loose"); === compares type AND value ("strict").
//   Interviewers use this to test PHP-specific gotchas that don't exist in most languages.
// - PHP 8 changed non-numeric string vs number comparisons: "abc" == 0 is now false (PHP 7
//   said true). Numeric strings still compare numerically: "1" == "01" is true.
// - Floats are binary approximations - 0.1 + 0.2 !== 0.3. Never == compare floats directly.
// - intdiv() does integer division and throws on divide-by-zero; / always returns a float
//   unless both operands divide evenly... actually / can still return int for exact division,
//   the real rule is: / promotes to float only when the result isn't a whole number in memory.

// --- type juggling table ---
$pairs = [
    ["1", "01"],   // true: both numeric strings, compared as numbers
    ["10", "1e1"], // true: "1e1" is a numeric string equal to 10
    ["abc", 0],    // PHP 8: false (PHP 7 was true) - non-numeric string never equals a number
    ["1", 1],      // true: numeric string coerces to int
    [0, false],    // true: loose comparison coerces false to 0
    ["0", false],  // true: "0" is falsy, coerces to false
    ["", null],    // true: both coerce to falsy/empty
];
foreach ($pairs as [$a, $b]) {
    $av = var_export($a, true);
    $bv = var_export($b, true);
    $loose = ($a == $b) ? "true" : "false";
    $strict = ($a === $b) ? "true" : "false";
    printf("%-8s == %-8s -> loose=%-5s strict=%-5s\n", $av, $bv, $loose, $strict);
}

// --- string functions ---
$s = "Hello, Brush Up!";
var_dump(str_contains($s, "Brush Up"));
printf("sprintf padded: [%5d] [%-5d] [%05.2f]\n", 42, 42, 3.1);
$parts = explode(", ", $s);
echo "explode: " . implode(" | ", $parts) . "\n";
echo "ucfirst: " . ucfirst("world") . "\n";
echo "mb_strlen (multibyte-safe): " . mb_strlen("héllo") . " vs strlen (bytes): " . strlen("héllo") . "\n";

// --- int/float pitfalls ---
$sum = 0.1 + 0.2;
var_dump($sum === 0.3);                     // false: binary float representation error
var_dump(abs($sum - 0.3) < PHP_FLOAT_EPSILON); // correct way to compare floats

echo "intdiv(7, 2): " . intdiv(7, 2) . "\n"; // 3, truncates toward zero, returns int
echo "7 / 2: " . (7 / 2) . "\n";             // 3.5, / always promotes non-exact division to float

// --- casting ---
var_dump((int) "42abc");   // 42: leading numeric prefix is parsed, rest ignored
var_dump((float) "3.14");  // float(3.14)
var_dump((bool) "0");      // false: "0" is the one non-empty string that's falsy
var_dump((bool) "0.0");    // true: only the exact string "0" is falsy, "0.0" is not
var_dump((array) "x");     // array(1) { [0]=> string(1) "x" }

// Interview notes:
// - Prefer === over == unless you specifically want type coercion.
// - "abc" == 0 flipping to false in PHP 8 is a common "what changed" interview question.
// - Never compare floats with ==/===; compare the absolute difference against an epsilon.
