<?php
declare(strict_types=1);

// Step 1: Hello World - echo vs print, variables, interpolation, heredoc
// - echo takes multiple comma-separated args and returns nothing; print takes one arg and
//   returns 1, so print can be used inside an expression - interviewers ask this to check
//   you know echo is (marginally) faster since it skips the return value.
// - "{$x}" interpolates a variable directly inside a double-quoted string; single-quoted
//   strings never interpolate - '{$x}' would print the literal text.
// - declare(strict_types=1) must be the first statement; it turns off PHP's automatic type
//   coercion for typed function calls in this file, forcing exact-type matches.
// - var_dump() shows both the type and value, which is why it beats echo for debugging.

$name = "Nova";
$age = 7;

echo "echo: hello, " . $name . "\n";   // concatenation with the . operator
print "print: hello again\n";           // print returns int(1), rarely used for that

// string interpolation - braces make the boundary explicit, especially with property access
echo "interpolated: {$name} is {$age} years old\n";

// heredoc - like a double-quoted string but multi-line, no escaping needed for quotes
$bio = <<<EOT
Name: {$name}
Age: {$age}
EOT;
echo $bio . "\n";

// nowdoc (single-quoted heredoc marker) - no interpolation at all, like a single-quoted string
$raw = <<<'EOT'
Literal {$name}, not interpolated
EOT;
echo $raw . "\n";

// var_dump of scalar types
var_dump($name);   // string(4) "Nova"
var_dump($age);    // int(7)
var_dump(3.14);    // float(3.14)
var_dump(true);    // bool(true)
var_dump(null);    // NULL

// common mistake: forgetting that print() is an expression while echo is a statement -
// echo cannot be used inside another expression like $x = echo "hi"; that is a parse error.
// print CAN be used that way: $result = (print "hi\n"); assigns int(1) to $result.
$result = (print "print as expression: ");
echo "result=" . $result . "\n";

// Interview notes:
// - echo vs print: echo is a language construct with no return value and multi-arg support;
//   print always returns 1 and takes exactly one argument.
// - Double vs single quotes: only double quotes (and heredoc) interpolate variables/escapes.
// - strict_types affects only calls made FROM this file, not calls INTO this file from
//   elsewhere - a frequent point of confusion in interviews.
