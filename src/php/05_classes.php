<?php
declare(strict_types=1);

// Step 5: Classes - constructor promotion, readonly, static, __toString, interfaces, enums
// - Constructor property promotion declares and assigns a property in one line in the
//   parameter list, removing the old $this->x = $x; boilerplate.
// - readonly properties can be set once (usually in the constructor) and never reassigned -
//   PHP throws an Error on a second write, giving you immutability without a full value object.
// - static properties/methods are shared across all instances, like a class-level global.
// - __toString lets an object be used anywhere a string is expected, including string
//   interpolation and echo.
// - Backed enums attach a scalar value to each case and support methods, ::cases(), and
//   match expressions for exhaustive, type-safe branching.

interface Speaks {
    public function speak(): string;
}

class Robot implements Speaks {
    public static int $unitsBuilt = 0; // shared across every Robot instance

    public function __construct(
        public readonly string $model, // promoted + readonly: set once, never mutated again
        private int $volume = 5,
    ) {
        self::$unitsBuilt++;
    }

    public function speak(): string {
        return str_repeat("BEEP ", min($this->volume, 3));
    }

    public function __toString(): string {
        return "Robot({$this->model})";
    }
}

$r1 = new Robot("T-800");
$r2 = new Robot("Wall-E", volume: 1);
echo "toString: {$r1}\n";                        // __toString invoked by interpolation
echo "speak: " . $r1->speak() . "\n";
echo "static count shared: " . Robot::$unitsBuilt . "\n"; // 2, shared across instances
// $r1->model = "X"; // <- would throw: Error, cannot modify readonly property

// --- enums: backed, methods, cases() ---
enum Status: string {
    case Active = "active";
    case Paused = "paused";
    case Done = "done";

    public function label(): string {
        // match is exhaustive-checked for enum cases at the language level in practice
        return match ($this) {
            self::Active => "In progress",
            self::Paused => "On hold",
            self::Done => "Complete",
        };
    }
}

foreach (Status::cases() as $status) {
    echo "{$status->value} -> {$status->label()}\n";
}
$fromValue = Status::from("paused"); // throws ValueError if the value doesn't match any case
echo "from('paused'): {$fromValue->name}\n";

// Interview notes:
// - readonly blocks writes to the property itself (including array-append via []=), but if
//   the property holds an OBJECT, that object's own methods can still mutate its internal
//   state - readonly only stops reassignment, not deep mutation through the held reference.
// - Prefer backed enums over old class-constant "enum" patterns for exhaustive matching.
// - Interfaces define a contract only; implementing classes supply the actual behavior.
