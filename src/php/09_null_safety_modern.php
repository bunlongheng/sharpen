<?php
declare(strict_types=1);

// Step 9: Null safety and modern PHP - ??, ??=, nullsafe ?->, readonly classes, never
// - The null coalescing operator ?? returns the left side unless it's null (not just falsy),
//   and unlike isset()-based checks it works safely even if the variable is undefined.
// - ??= assigns only when the left side is null - a compact way to fill in defaults.
// - The nullsafe operator ?-> short-circuits an entire chain to null the moment any link is
//   null, instead of throwing "call to a member function on null" partway through.
// - A readonly class (PHP 8.2+) makes every property readonly by default without repeating
//   the keyword on each one.
// - A function declared never never returns at all (always throws or exits) - useful for
//   assertion/guard helpers, documented here since it can't be demonstrated by calling it
//   without stopping the script.

$config = ["timeout" => null];
echo "?? on missing key: " . ($config["retries"] ?? 3) . "\n";
echo "?? on null value: " . ($config["timeout"] ?? 30) . "\n"; // null coalesces past too

$cache = [];
$cache["hits"] ??= 0;  // sets to 0 since it's unset (treated as null)
$cache["hits"] ??= 99; // no-op now, already non-null
echo "??= result: {$cache['hits']}\n";

// --- nullsafe chaining ---
readonly class Address {
    public function __construct(public string $city) {}
}
readonly class Profile { // readonly class: every property below is implicitly readonly
    public function __construct(public ?Address $address = null) {}
}
$withAddress = new Profile(new Address("Austin"));
$withoutAddress = new Profile();
echo "nullsafe found: " . ($withAddress->address?->city ?? "unknown") . "\n";
echo "nullsafe short-circuits: " . ($withoutAddress->address?->city ?? "unknown") . "\n";

// --- named arguments with a class constructor ---
final class Range {
    public function __construct(public readonly int $min, public readonly int $max) {}
}
$range = new Range(max: 10, min: 1); // named args: order no longer has to match declaration
echo "named args: {$range->min}..{$range->max}\n";

// --- enums in a match, first-class citizens ---
enum Tier {
    case Free;
    case Pro;
    case Enterprise;
}
function discountFor(Tier $tier): float {
    return match ($tier) {
        Tier::Free => 0.0,
        Tier::Pro => 0.10,
        Tier::Enterprise => 0.25,
    };
}
foreach ([Tier::Free, Tier::Pro, Tier::Enterprise] as $tier) {
    echo "{$tier->name} discount: " . discountFor($tier) . "\n";
}

// never return type (documented, not called - calling it would end the script):
// function assertPositive(int $n): never {
//     if ($n <= 0) { throw new \InvalidArgumentException("must be positive"); }
//     throw new \LogicException("assertPositive never returns normally"); // unreachable path
// }

// Interview notes:
// - ?? checks for null specifically (via isset semantics); it is NOT the same as ?: which
//   checks truthiness and would treat "0" or 0 as falsy too.
// - ?-> stops evaluating the WHOLE chain on the first null, returning null - it does not
//   throw, and chaining ?-> with -> after a null link is still safe once ?-> has appeared.
// - match() uses strict (===) comparison and has no fallthrough, unlike switch.
