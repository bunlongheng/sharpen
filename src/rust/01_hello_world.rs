// Step 1: Hello World - println! formatting, let/mut, shadowing, types, tuples, arrays
// - println! formatting: {} for Display, {:?} for Debug, {:>8} for width/alignment, {:.2} for precision.
// - let bindings are immutable by default; add mut to allow reassignment - Rust opts into mutation.
// - Shadowing lets you rebind the same name (even to a new type) without mut; the old value is
//   just inaccessible, not destroyed.
// - Type inference fills in types the compiler can work out; annotate when it can't or for clarity.
// - Tuples group different types with fixed length; arrays hold a fixed length of ONE type.

fn main() {
    // --- basic types and inference ---
    let age: u32 = 30; // explicit type annotation
    let name = "Nova"; // inferred as &str
    let pi = 3.14159_f64;
    println!("Display {{}}: name={}, age={}", name, age);
    println!("Debug {{:?}}: name={:?}, age={:?}", name, age);
    println!("Right-aligned {{:>8}}: |{:>8}|", name);
    println!("Precision {{:.2}}: pi rounded = {:.2}", pi);

    // --- let / mut / shadowing ---
    let count = 1;
    // count = 2; // <- would fail: error[E0384]: cannot assign twice to immutable variable `count`
    let mut mutable_count = 1;
    mutable_count += 1;
    println!("mut allows reassignment: {} (started from count={})", mutable_count, count);

    let value = "5"; // shadowing: same name, new type, no mut needed
    let value: i32 = value.parse().unwrap();
    let value = value * 2;
    println!("shadowed value (str -> i32 -> doubled): {}", value);

    // --- tuples: fixed length, mixed types ---
    let point: (i32, i32, &str) = (3, 4, "origin-offset");
    let (x, y, label) = point; // destructuring
    println!("tuple point={:?}, unpacked x={} y={} label={}", point, x, y, label);
    println!("tuple field access: point.0={}, point.1={}", point.0, point.1);

    // --- arrays: fixed length, single type ---
    let nums: [i32; 5] = [10, 20, 30, 40, 50];
    println!("array: {:?}, len={}, first={}, last={}", nums, nums.len(), nums[0], nums[4]);
    let zeros = [0; 3]; // repeat syntax: [value; count]
    println!("repeat array: {:?}", zeros);

    // Interview notes:
    // - {} requires the Display trait; {:?} requires Debug (usually #[derive(Debug)]).
    // - Shadowing vs mut: shadowing can change type and stays immutable between rebinds; mut
    //   keeps the same type and the same memory slot.
    // - Arrays are stack-allocated and fixed-size; use Vec<T> (see step 4) for growable data.
}
