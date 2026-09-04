<?php
declare(strict_types=1);

// Step 7: Exceptions - try/catch/finally, custom exceptions, rethrow, TypeError vs Exception
// - finally always runs, whether the try block succeeds, throws, or returns early - use it
//   for cleanup that must never be skipped.
// - Multiple catch blocks are tried top to bottom; catch the more specific type first, or
//   combine types with A|B in one catch.
// - A custom exception extends \Exception and can carry a numeric code plus a "previous"
//   exception, preserving the original cause when you wrap and rethrow.
// - throw is an EXPRESSION in PHP 8, not just a statement - it can appear inside a ternary
//   or arrow function body, e.g. fn($x) => $x ?? throw new InvalidArgumentException(...).
// - TypeError/ValueError extend \Error, not \Exception - a strict_types type mismatch is a
//   programmer mistake, not a runtime failure, so catch \Throwable to catch both kinds.

class InsufficientFundsException extends \Exception {
    public function __construct(string $message, private readonly float $shortfall) {
        parent::__construct($message, code: 400);
    }
    public function getShortfall(): float { return $this->shortfall; }
}

function withdraw(float $balance, float $amount): float {
    if ($amount > $balance) throw new InsufficientFundsException("cannot withdraw {$amount}", $amount - $balance);
    return $balance - $amount;
}

// --- try/catch/finally, custom exception with code ---
try {
    withdraw(100.0, 150.0);
} catch (InsufficientFundsException $e) {
    echo "caught: {$e->getMessage()} (code={$e->getCode()}, short by {$e->getShortfall()})\n";
} finally {
    echo "finally always runs\n";
}

// --- multiple catch types, combined with | ---
function parseAmount(string $raw): float {
    if ($raw === "") throw new \InvalidArgumentException("empty amount");
    return (float) $raw;
}
try {
    parseAmount("");
} catch (\InvalidArgumentException|\TypeError $e) {
    echo "combined catch: " . get_class($e) . " - {$e->getMessage()}\n";
}

// --- throw as an expression ---
$normalize = fn(?string $s) => $s ?? throw new \InvalidArgumentException("null not allowed");
try {
    $normalize(null);
} catch (\InvalidArgumentException $e) {
    echo "throw-as-expression caught: {$e->getMessage()}\n";
}

// --- rethrow with previous, preserving the original cause ---
try {
    try {
        withdraw(10.0, 20.0);
    } catch (InsufficientFundsException $inner) {
        throw new \RuntimeException("withdraw failed upstream", previous: $inner);
    }
} catch (\RuntimeException $outer) {
    echo "outer: {$outer->getMessage()}, caused by: " . $outer->getPrevious()->getMessage() . "\n";
}

// --- TypeError from strict_types is an Error, not an Exception ---
function needsInt(int $n): int { return $n * 2; }
try {
    needsInt("not an int"); // intentional type violation, to trigger a TypeError
} catch (\TypeError $e) {
    // drop the ", called in <file> on line N" suffix - it leaks a machine-specific path
    $msg = explode(", called in", $e->getMessage())[0];
    echo "TypeError caught (extends \\Error, not \\Exception): {$msg}\n";
}

// Interview notes:
// - catch (\Throwable $e) is the common ancestor of \Exception and \Error - use it only at
//   top-level boundaries, not to silently swallow bugs.
// - finally can override a return value if it also returns - best avoided entirely.
