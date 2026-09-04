// Step 9: Generics & Delegates - constraints, Func/Action/Predicate, lambdas, delegates, events
// - Generic constraints (where T : IComparable<T>) let the compiler verify at compile time that
//   a type parameter supports the operations the generic code needs, instead of failing at runtime.
// - Func<..., TResult> returns a value, Action<...> returns void, Predicate<T> is a Func<T, bool>
//   specialized for filtering - all three are just named delegate shapes.
// - Lambdas (x => x * 2) are the shorthand syntax most commonly used to create delegate instances
//   and LINQ predicates without a named method.
// - Events wrap a delegate with add/remove-only access from outside the declaring class, the
//   standard C# pattern for publish/subscribe without exposing Invoke to subscribers.
// - Nullable reference types (enabled via <Nullable>enable</Nullable>) make the compiler warn
//   when a possibly-null reference is used without a check - a compile-time hint, not a runtime
//   guarantee.

T Max<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) >= 0 ? a : b;  // generic method

var box1 = new Box<int>(5);
var box2 = new Box<int>(9);
Console.WriteLine($"generic class + constraint: box1.CompareTo(box2) = {box1.CompareTo(box2)}");
Console.WriteLine($"generic method Max: {Max(3, 7)}, Max(\"ada\", \"grace\"): {Max("ada", "grace")}");

// --- Func, Action, Predicate, lambdas ---
Func<int, int, int> add = (a, b) => a + b;
Action<string> log = message => Console.WriteLine($"Action log: {message}");
Predicate<int> isEven = n => n % 2 == 0;

Console.WriteLine($"Func lambda: add(2, 3) = {add(2, 3)}");
log("delegates in action");
Console.WriteLine($"Predicate lambda: isEven(4) = {isEven(4)}");

// --- delegates and events ---
var stock = new Stock();
stock.PriceChanged += (oldPrice, newPrice) =>
    Console.WriteLine($"event raised: price changed {oldPrice:F2} -> {newPrice:F2}");
stock.Price = 10.50m;
stock.Price = 12.75m;

// --- nullable reference types note ---
string? maybeNull = null;
Console.WriteLine($"nullable reference type: {maybeNull ?? "fallback used because it was null"}");
// With <Nullable>enable</Nullable>, assigning null to a plain `string` (not `string?`) would be
// a compiler warning, not an error - it still compiles, but flags a likely bug.

class Box<T> where T : IComparable<T>
{
    public T Value { get; }
    public Box(T value) => Value = value;
    public int CompareTo(Box<T> other) => Value.CompareTo(other.Value);  // constraint enables this
}

delegate void PriceChangedHandler(decimal oldPrice, decimal newPrice);

class Stock
{
    public event PriceChangedHandler? PriceChanged;  // event: add/remove only from outside
    decimal price;
    public decimal Price
    {
        get => price;
        set
        {
            decimal old = price;
            price = value;
            PriceChanged?.Invoke(old, price);  // null-conditional: safe if nobody subscribed
        }
    }
}

// Interview notes:
// - Common mistake: forgetting the null-conditional `?.Invoke` on an event before raising it -
//   invoking a null event delegate directly throws NullReferenceException if nobody subscribed.
// - Multiple constraints combine with commas (where T : class, IComparable<T>, new()); `new()`
//   must always come last in the constraint list.
