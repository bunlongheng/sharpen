<?php
declare(strict_types=1);

// Step 2: Arrays - indexed vs associative, map/filter/reduce, spread, destructuring
// - PHP has one array type that acts as both an indexed list and an ordered hash map.
// - array_map/array_filter/array_reduce with arrow functions (fn() =>) are the idiomatic
//   functional-style toolkit; arrow fns auto-capture outer variables by value.
// - array_search and in_array default to loose (==) comparison - pass strict:true or you can
//   silently match "0" against 0 or false. A classic interview trap.
// - The spread operator (...) merges arrays inline; list()/[] destructures return values.
// - foreach by reference (&$v) leaves the reference bound to the last element after the loop -
//   reusing that variable name again silently corrupts array data.

$indexed = ["a", "b", "c"];
$assoc = ["name" => "Nova", "role" => "engineer"];
echo "indexed[1]: {$indexed[1]}\n";
echo "assoc[name]: {$assoc['name']}\n";

// --- map / filter / reduce with arrow functions ---
$nums = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $nums);
$evens = array_filter($nums, fn($n) => $n % 2 === 0);
$sum = array_reduce($nums, fn($carry, $n) => $carry + $n, 0);
echo "doubled: " . implode(",", $doubled) . "\n";
echo "evens: " . implode(",", $evens) . "\n"; // array_filter preserves original keys
echo "sum: {$sum}\n";

echo "array_keys(assoc): " . implode(",", array_keys($assoc)) . "\n";
var_dump(in_array("2", [1, 2, 3], true));  // false: strict mode, "2" !== 2
var_dump(in_array("2", [1, 2, 3]));        // true: loose mode coerces "2" == 2

// array_search: loose by default, same trap as in_array
$mixed = [false, 0, "", null];
var_dump(array_search("x", $mixed));        // 0 (loose: "x" == false at index 0!)
var_dump(array_search("x", $mixed, true));  // false: nothing strictly equals "x"

// --- spread operator ---
$first = [1, 2];
$second = [3, 4];
$combined = [...$first, ...$second, 5];
echo "spread combined: " . implode(",", $combined) . "\n";

// --- destructuring ---
[$x, $y] = [10, 20];
["name" => $n, "role" => $r] = $assoc;
echo "destructured: x={$x} y={$y} name={$n} role={$r}\n";

// --- foreach by reference trap ---
$data = [1, 2, 3];
foreach ($data as &$v) {
    $v *= 10;
}
unset($v); // required! without this, $v still points at $data's last element
foreach ($data as $v) {
    // this loop reuses $v; without unset() above, the last element would get overwritten
}
echo "after ref foreach + reused var: " . implode(",", $data) . "\n";

// Interview notes:
// - array_filter re-indexes nothing by default; use array_values() to reset keys 0..n-1.
// - Prefer strict comparison (third arg true) in in_array/array_search unless loose is intended.
// - Always unset() a by-reference foreach variable to avoid aliasing bugs in later loops.
