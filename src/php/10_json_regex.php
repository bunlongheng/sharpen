<?php
declare(strict_types=1);

// Step 10: JSON and regex - encode flags, decode assoc vs object, preg_match, sprintf padding
// - json_encode() takes bitmask flags: JSON_PRETTY_PRINT for readable output, and
//   JSON_UNESCAPED_SLASHES/JSON_UNESCAPED_UNICODE to stop it from escaping "/" and non-ASCII
//   characters into \uXXXX sequences.
// - json_decode($s, true) returns associative arrays; without true (or with false) it returns
//   stdClass objects - forgetting the flag is a common source of "undefined array key" bugs.
// - JSON_THROW_ON_ERROR turns malformed JSON into a JsonException instead of silently
//   returning null, which interviewers expect over manually checking json_last_error().
// - preg_match() fills its third argument with numbered AND named capture groups; return
//   value is 1 (matched), 0 (no match), or false (regex error) - never loosely compare it.
// - preg_replace_callback() runs a callback per match, useful when the replacement needs
//   logic that a plain replacement string can't express.

$data = ["name" => "Nova", "path" => "a/b", "tags" => ["php", "8"]];
$pretty = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
echo "pretty json:\n{$pretty}\n";

// --- decode: assoc vs object ---
$json = '{"id": 1, "name": "Zoe"}';
$asArray = json_decode($json, true);
$asObject = json_decode($json);
echo "assoc access: {$asArray['name']}\n";
echo "object access: {$asObject->name}\n";

// --- JSON_THROW_ON_ERROR ---
try {
    json_decode("{invalid", flags: JSON_THROW_ON_ERROR);
} catch (\JsonException $e) {
    echo "JSON_THROW_ON_ERROR caught: {$e->getMessage()}\n";
}

// --- preg_match with numbered and named groups ---
$line = "2026-09-03: build passed";
if (preg_match('/^(?<date>\d{4}-\d{2}-\d{2}): (?<status>\w+)/', $line, $m)) {
    echo "named groups: date={$m['date']} status={$m['status']}\n";
    echo "numbered groups: {$m[1]} / {$m[2]}\n";
}
// strict check: preg_match can return false on a broken pattern, not just 0 or 1
$ok = preg_match('/\d+/', "no digits here");
var_dump($ok); // int(0), not false - false only happens on a regex engine error

// --- preg_replace_callback ---
$text = "cost: 5 dollars, tax: 2 dollars";
$doubled = preg_replace_callback('/\d+/', fn($m) => (string)((int)$m[0] * 2), $text);
echo "doubled numbers: {$doubled}\n";

// --- sprintf padding ---
foreach ([1, 22, 333] as $n) {
    printf("padded: [%5d] zero-padded: [%05d]\n", $n, $n);
}

// Interview notes:
// - Always pass JSON_THROW_ON_ERROR (or check json_last_error()) - a bare json_decode() on
//   bad input returns null, which is indistinguishable from a valid JSON literal null.
// - preg_match returning 0 (no match) is falsy just like false (error); use === false or
//   === 0 explicitly if the distinction matters, since == 0 == false would blur both cases.
