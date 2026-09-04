<?php
declare(strict_types=1);

// Step 8: Generators and iterators - yield, yield from, Iterator interface, memory
// - A generator function contains yield and returns a Generator the moment it's called,
//   without running any code yet - execution resumes from the last yield each time you
//   advance it, so values are produced lazily, one at a time.
// - yield $key => $value lets a generator emit associative pairs, not just plain values.
// - Generators are memory-light: range(1, 1_000_000) builds the whole array in memory now,
//   while a generator yielding the same sequence holds only the current value at any moment.
// - yield from delegates to another generator or iterable, flattening it into the outer one.
// - The Iterator interface (current/key/next/rewind/valid) is the manual, low-level way to
//   make an object foreach-able; generators are the easy way to get the same result.

function countUp(int $start, int $end): \Generator {
    for ($i = $start; $i <= $end; $i++) {
        yield $i; // pauses here, resumes on the next foreach tick
    }
}
foreach (countUp(1, 5) as $n) {
    echo "countUp: {$n}\n";
}

// --- yield with keys ---
function keyedPairs(): \Generator {
    yield "a" => 1;
    yield "b" => 2;
}
foreach (keyedPairs() as $k => $v) {
    echo "keyed: {$k}={$v}\n";
}

// --- memory comparison: array vs generator (illustrative, small N to stay fast) ---
$arrayVersion = range(1, 5);              // materializes all 5 ints immediately
$generatorVersion = countUp(1, 5);        // holds only one value at a time as it's consumed
echo "array memory holds all up front: " . count($arrayVersion) . " ints\n";
$sameValues = iterator_to_array($generatorVersion) === $arrayVersion;
echo "generator produces lazily, same values: " . ($sameValues ? "yes" : "no") . "\n";

// --- yield from delegation ---
function inner(): \Generator {
    yield 1;
    yield 2;
}
function outer(): \Generator {
    yield 0;
    yield from inner(); // flattens inner()'s yields into outer()'s stream
    yield 3;
}
echo "yield from: " . implode(",", iterator_to_array(outer(), false)) . "\n";

// --- manual Iterator interface implementation ---
class Countdown implements \Iterator {
    private int $current;
    public function __construct(private readonly int $start) {
        $this->current = $start;
    }
    public function current(): mixed { return $this->current; }
    public function key(): mixed { return $this->start - $this->current; }
    public function next(): void { $this->current--; }
    public function rewind(): void { $this->current = $this->start; }
    public function valid(): bool { return $this->current >= 0; }
}
foreach (new Countdown(3) as $step => $value) {
    echo "Countdown step={$step} value={$value}\n";
}

// Interview notes:
// - A generator can only be iterated once; iterating it a second time throws an Exception -
//   call the function again to get a fresh Generator if you need to loop twice.
// - iterator_to_array() defaults to preserving keys, which can silently drop values with
//   duplicate keys - pass false as the second argument to reindex sequentially instead.
