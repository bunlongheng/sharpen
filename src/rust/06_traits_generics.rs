// Step 6: Traits & Generics - default methods, trait bounds, impl Trait, dyn Trait
// - A trait defines shared behavior; a default method body is used unless a type overrides it.
// - A generic fn with a trait bound (T: Trait) is monomorphized at compile time - zero runtime cost.
// - impl Trait in argument/return position is sugar for a bound, hiding the concrete type.
// - dyn Trait is a trait object: dynamic dispatch via a vtable, needed when types differ at
//   runtime (e.g. mixed types in one Vec) - the tradeoff is a small runtime cost vs generics.

trait Describe {
    fn name(&self) -> String;
    fn describe(&self) -> String { // default method: callers get this unless they override it
        format!("This is {}", self.name())
    }
}

struct Dog;
struct Robot;

impl Describe for Dog {
    fn name(&self) -> String {
        "a dog".to_string()
    }
    // uses the default describe()
}

impl Describe for Robot {
    fn name(&self) -> String {
        "a robot".to_string()
    }
    fn describe(&self) -> String { // overrides the default
        format!("BEEP: {} reporting", self.name())
    }
}

// generic fn with a trait bound: T must implement Describe
fn print_description<T: Describe>(item: &T) {
    println!("{}", item.describe());
}

// impl Trait in argument position: sugar for the same bound as above
fn print_name(item: &impl Describe) {
    println!("name only: {}", item.name());
}

// impl Trait in return position: caller sees "some Describe", not the concrete type
fn make_dog() -> impl Describe {
    Dog
}

fn main() {
    let dog = Dog;
    let robot = Robot;
    print_description(&dog);
    print_description(&robot);
    print_name(&make_dog());

    // --- dyn Trait: needed to store different concrete types in one collection ---
    let animals: Vec<Box<dyn Describe>> = vec![Box::new(Dog), Box::new(Robot)];
    for a in &animals {
        println!("dyn dispatch: {}", a.describe());
    }
    // let bad: Vec<Dog> = vec![Dog, Robot]; // <- would fail: error[E0308]: mismatched types
    //                                          (a plain Vec<T> needs one concrete type, not a mix)

    // Interview notes:
    // - Generics (impl Trait / <T: Trait>) are resolved at compile time: fast, but each
    //   instantiation adds to binary size (monomorphization).
    // - dyn Trait resolves the method call at runtime through a vtable: one copy of the code,
    //   slightly slower calls, and it's the only way to mix concrete types behind one interface.
    // - Default trait methods let you add new methods to a trait later without breaking every
    //   existing implementor.
}
