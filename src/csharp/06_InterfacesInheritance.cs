// Step 6: Interfaces & Inheritance - default methods, abstract classes, virtual/override, sealed, casts
// - Interfaces can ship a default method body (C# 8+), letting you add new members to an
//   interface without breaking every existing implementer.
// - Abstract classes can mix implemented and unimplemented (abstract) members; they cannot be
//   instantiated directly, only inherited from.
// - virtual marks a method as overridable; override supplies the new implementation; sealed on
//   a class blocks any further inheritance from it.
// - Polymorphism: a List<BaseType> can hold any derived type, and calling a virtual/override
//   member dispatches to the actual runtime type, not the compile-time type.
// - `as` returns null on a failed cast instead of throwing; `is` just tests the type; a plain
//   cast `(Type)obj` throws InvalidCastException on failure.

// --- polymorphism via List<Base> ---
List<Animal> animals = new() { new Dog("Rex"), new Cat("Milo") };
foreach (Animal a in animals)
    Console.WriteLine($"polymorphic dispatch: {a.Greet()}, speaks: {a.Speak()}");

// --- default interface method ---
foreach (IAnimal a in animals)
    Console.WriteLine($"default interface method: {a.Describe()}");

// --- is / as casts ---
Animal firstAnimal = animals[0];
if (firstAnimal is Dog dog)
    Console.WriteLine($"is pattern cast: {dog.Name} is a Dog");

Animal secondAnimal = animals[1];
Dog? maybeDog = secondAnimal as Dog;  // fails gracefully: Cat is not a Dog
Console.WriteLine($"as cast on wrong type: {(maybeDog is null ? "null, no exception" : maybeDog.Name)}");

interface IAnimal
{
    string Name { get; }
    string Speak();
    string Describe() => $"{Name} says {Speak()}";  // default interface method
}

abstract class Animal : IAnimal
{
    public string Name { get; }
    protected Animal(string name) => Name = name;
    public abstract string Speak();  // must be implemented by derived classes
    public virtual string Greet() => $"Hi, I'm {Name}";  // can be overridden
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }  // base() forwards to the abstract class constructor
    public override string Speak() => "Woof";
    public override string Greet() => base.Greet() + ", a very good dog";  // extend, not replace
}

sealed class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public override string Speak() => "Meow";  // sealed class: Cat cannot be inherited further
}

// Interview notes:
// - Common mistake: calling a non-virtual method through a base reference always uses the base
//   implementation (no dispatch); only virtual/abstract/override members are polymorphic.
// - A class can extend only one base class but implement many interfaces - interfaces are how
//   C# gets multiple-inheritance-like behavior without the diamond problem.
