// Step 2: Ownership & Borrowing - move semantics, clone, & vs &mut, borrow rules, slices
// - Every value has one owner; when the owner goes out of scope, the value is dropped.
// - Assigning a non-Copy value (like String) MOVES it - the old binding becomes invalid.
// - .clone() makes a deep copy so both bindings stay valid, at the cost of the copy.
// - &T is a shared (read-only) borrow, many allowed at once; &mut T is exclusive, only one at
//   a time and never alongside a shared borrow - the compiler enforces this at compile time.
// - Slices (&[T], &str) borrow a contiguous view into a collection without owning it.

fn main() {
    // --- move semantics ---
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved into s2; s1 is no longer valid
    // println!("{}", s1); // <- would fail: error[E0382]: borrow of moved value: `s1`
    println!("after move, s2 owns the data: {}", s2);

    // --- clone: explicit deep copy ---
    let s3 = s2.clone();
    println!("s2 still valid after clone: {}, s3 is an independent copy: {}", s2, s3);

    // --- Copy types don't move, they copy ---
    let n1 = 5;
    let n2 = n1; // i32 implements Copy, so n1 is still usable
    println!("Copy types: n1={} n2={} (both valid)", n1, n2);

    // --- & shared borrow vs &mut exclusive borrow ---
    let mut data = vec![1, 2, 3];
    print_slice(&data); // shared borrow: read-only, doesn't take ownership
    push_ten(&mut data); // exclusive borrow: allowed to mutate
    println!("after push_ten: {:?}", data);

    // --- borrow rules: one &mut XOR many & ---
    let r1 = &data;
    let r2 = &data; // multiple shared borrows are fine at the same time
    println!("two shared borrows at once: {:?} {:?}", r1, r2);
    // let r3 = &mut data; // if placed HERE, with r1/r2 still borrowed and used below, this
    //                         would fail: error[E0502]: cannot borrow `data` as mutable because
    //                         it is also borrowed as immutable
    let r3 = &mut data; // fine here: r1 and r2's last use was already above (non-lexical lifetimes)
    r3.push(4);
    println!("exclusive borrow after shared borrows ended: {:?}", r3);

    // --- slices: borrowed views, no ownership ---
    let arr = [10, 20, 30, 40, 50];
    let middle: &[i32] = &arr[1..4]; // slice of the array
    println!("array slice [1..4]: {:?}", middle);
    let text = String::from("hello world");
    let first_word: &str = &text[0..5]; // string slice
    println!("string slice [0..5]: {}", first_word);

    // Interview notes:
    // - Moves prevent double-free bugs at compile time instead of runtime or GC.
    // - "&mut xor &" (aliasing xor mutability) is what lets Rust's borrow checker rule out
    //   data races at compile time - no lock needed for single-threaded aliasing.
    // - A slice is a (pointer, length) pair; it borrows, so it can't outlive what it points to.
}

fn print_slice(v: &[i32]) {
    println!("borrowed read-only: {:?}", v);
}

fn push_ten(v: &mut Vec<i32>) {
    v.push(10);
}
