<?php
declare(strict_types=1);

// Step 6: Inheritance and traits - abstract classes, trait conflicts, final, late static binding
// - An abstract class can't be instantiated and may declare abstract methods that every
//   concrete subclass must implement - it defines a contract plus shared implementation.
// - Traits copy-paste a set of methods into a class (horizontal reuse); two traits with the
//   same method name conflict and must be resolved with insteadof / as.
// - final on a class or method blocks further overriding - use it to lock down behavior
//   interviewers expect you to protect (e.g. a security-sensitive method).
// - Late static binding: static:: resolves to the CALLING class at runtime, while self::
//   always resolves to the class where the code is literally written - this matters in
//   factory methods inherited by subclasses.

abstract class Shape {
    abstract public function area(): float;

    public function describe(): string {
        // self:: here would always print "Shape", even when called on a subclass
        return static::class . " area=" . number_format($this->area(), 2);
    }

    public static function create(): static {
        return new static(); // late static binding: returns the actual subclass, not Shape
    }
}

final class Square extends Shape { // final: Square cannot be extended further
    public function __construct(private float $side = 2.0) {}
    public function area(): float {
        return $this->side ** 2;
    }
}

$sq = Square::create(); // static:: makes this return a Square, not a Shape
echo $sq->describe() . "\n";
var_dump($sq instanceof Shape);
var_dump($sq instanceof Square);

// --- traits with a name conflict, resolved via insteadof / as ---
trait Loud {
    public function greet(): string { return "HELLO!"; }
}
trait Quiet {
    public function greet(): string { return "...hello..."; }
}
class Persona {
    use Loud, Quiet {
        Loud::greet insteadof Quiet;   // pick Loud's version for the ambiguous method name
        Quiet::greet as whisper;       // but keep Quiet's version too, under a new name
    }
}
$p = new Persona();
echo "greet(): " . $p->greet() . "\n";
echo "whisper(): " . $p->whisper() . "\n";

// Interview notes:
// - Traits share implementation across unrelated class hierarchies; interfaces share only
//   a contract. A class can use many traits but each method name must resolve unambiguously.
// - static:: vs self:: only differs when a method is inherited and called on a subclass;
//   they behave identically when called directly on the defining class.
// - final exists at both the class level (no subclassing at all) and method level (no override).
