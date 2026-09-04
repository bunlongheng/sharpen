// Step 3: Structs & Enums - impl methods vs associated fns, derives, enums with data, match, Option
// - impl blocks add behavior to a struct; a method takes &self/&mut self/self, an associated
//   function (like new) does not and is called as Type::function().
// - #[derive(Debug, Clone, PartialEq)] auto-generates those trait impls instead of hand-writing them.
// - Rust enums can carry data per variant, unlike C-style enums - a sum type, not just a label.
// - match must be exhaustive - the compiler rejects it if a variant is missing, catching bugs
//   that a switch statement (with silent fallthrough) would miss.
// - Option<T> replaces null: Some(value) or None, forcing you to handle the missing case.

#[derive(Debug, Clone, PartialEq)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn new(width: f64, height: f64) -> Self { // associated function: Rectangle::new(...)
        Rectangle { width, height }
    }
    fn area(&self) -> f64 { // method: takes &self, called as rect.area()
        self.width * self.height
    }
    fn scale(&mut self, factor: f64) { // &mut self: mutates in place
        self.width *= factor;
        self.height *= factor;
    }
}

#[derive(Debug, PartialEq)]
enum Shape {
    Circle { radius: f64 }, // struct-like variant
    Square(f64),            // tuple-like variant
    Point,                  // unit variant, no data
}

fn shape_area(shape: &Shape) -> f64 {
    match shape { // exhaustive: every variant must be handled or it won't compile
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Square(side) => side * side,
        Shape::Point => 0.0,
        // omitting a variant here gives: error[E0004]: non-exhaustive patterns
    }
}

fn main() {
    let rect1 = Rectangle::new(3.0, 4.0);
    let mut rect2 = rect1.clone(); // needs #[derive(Clone)]
    rect2.scale(2.0);
    println!("rect1={:?} area={}", rect1, rect1.area());
    println!("rect2 (scaled clone)={:?} area={}", rect2, rect2.area());
    println!("PartialEq derive: rect1 == rect2 -> {}", rect1 == rect2);

    let shapes = [Shape::Circle { radius: 2.0 }, Shape::Square(3.0), Shape::Point];
    for s in &shapes {
        println!("{:?} area = {:.2}", s, shape_area(s));
    }

    // --- Option and if let ---
    let maybe_num: Option<i32> = Some(42);
    let nothing: Option<i32> = None;
    if let Some(n) = maybe_num {
        println!("if let unwraps Some: {}", n);
    }
    if let Some(n) = nothing {
        println!("won't print: {}", n);
    } else {
        println!("nothing is None, else branch runs");
    }
    println!("Option methods: unwrap_or(0)={}, is_some()={}", nothing.unwrap_or(0), maybe_num.is_some());

    // Interview notes:
    // - Prefer associated fn `new` over a public constructor pattern; there's no `new` keyword.
    // - match on enums is how Rust models state machines safely: add a variant, the compiler
    //   points at every match that now needs updating.
    // - Option<T> makes null-pointer bugs a compile-time error instead of a runtime crash.
}
