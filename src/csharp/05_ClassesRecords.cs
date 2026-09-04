// Step 5: Classes & Records - properties, constructors, object initializers, records, readonly struct
// - Auto-properties generate a hidden backing field for you; init-only setters allow assignment
//   only during object initialization, giving immutability without a constructor for every field.
// - required (C# 11+) forces callers to set a property during initialization, caught at compile
//   time rather than discovered later as a null reference at runtime.
// - Records are reference types with built-in value equality and ToString; classes need you to
//   write that yourself if you want it. readonly struct guarantees a value type cannot mutate
//   after construction, which the compiler enforces on every member.
// - static members belong to the type itself, not any instance, and are shared across all uses.

// --- object initializer ---
var manual = new Person("Nova", 25) { Email = "nova@example.com" };
Console.WriteLine($"object initializer: {manual}");

// --- static members ---
var p1 = Person.Create("Ada", 30, "ada@example.com");
var p2 = Person.Create("Grace", 28, "grace@example.com");
Console.WriteLine($"static factory + counter: {p1}, {p2}, total created: {Person.PersonCount}");

// --- records vs classes ---
var r1 = new PersonRecord("Zoe", 20);
var r2 = new PersonRecord("Zoe", 20);
var c1 = new PersonClass { Name = "Zoe", Age = 20 };
var c2 = new PersonClass { Name = "Zoe", Age = 20 };
Console.WriteLine($"record value equality: r1 == r2 -> {r1 == r2}");
Console.WriteLine($"class reference equality: c1 == c2 -> {c1 == c2}");
Console.WriteLine($"record auto ToString: {r1}");

// --- readonly struct ---
var price = new Money(19.99m, "USD");
// price.Amount = 5;  // <- would fail: readonly struct members cannot be reassigned after construction
Console.WriteLine($"readonly struct ToString override: {price}");

class Person
{
    public string Name { get; set; }               // auto-property, mutable
    public int Age { get; init; }                   // init-only, settable only at construction
    public required string Email { get; init; }     // required: caller must set this

    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    public override string ToString() => $"{Name} ({Age}), {Email}";

    public static int PersonCount { get; private set; } = 0;
    public static Person Create(string name, int age, string email)
    {
        PersonCount++;
        return new Person(name, age) { Email = email };
    }
}

record PersonRecord(string Name, int Age);
class PersonClass
{
    public string Name { get; init; } = "";
    public int Age { get; init; }
}

readonly struct Money
{
    public decimal Amount { get; }
    public string Currency { get; }
    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }
    public override string ToString() => $"{Amount:F2} {Currency}";
}

// Interview notes:
// - Common mistake: forgetting that init-only setters can still be called inside the constructor
//   body and via an object initializer, since both count as part of construction - only code
//   running after construction is blocked from using them.
// - Records generate ToString, Equals, and GetHashCode from their properties automatically;
//   classes get reference-based defaults for Equals and GetHashCode unless you override them.
