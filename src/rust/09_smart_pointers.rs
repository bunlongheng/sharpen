// Step 9: Smart Pointers - Box, Rc + RefCell, Rc::strong_count, Deref, Drop order
// - Box<T> is a heap allocation with a single owner; it's how you give a recursive type (like a
//   linked list) a known, fixed size - the recursion is behind a pointer instead of inline.
// - Rc<T> (reference counted) allows MULTIPLE owners of the same heap value, but only shared
//   (immutable) access - clone() bumps a counter, it doesn't copy the data.
// - RefCell<T> moves borrow-checking from compile time to runtime, enabling "interior
//   mutability" - mutating through a shared reference, which is normally forbidden.
// - Deref lets a smart pointer be used as if it were the value it wraps (Box<T> auto-derefs to &T).
// - Drop runs automatically when a value goes out of scope, in reverse declaration order.

use std::cell::RefCell;
use std::rc::Rc;

// recursive type: without Box this wouldn't compile (infinite size)
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}
use List::{Cons, Nil};

fn sum_list(list: &List) -> i32 { // reads the fields directly, not just via the Debug derive
    match list {
        Cons(value, rest) => value + sum_list(rest),
        Nil => 0,
    }
}

struct Noisy(&'static str);
impl Drop for Noisy {
    fn drop(&mut self) {
        println!("dropping: {}", self.0);
    }
}

fn main() {
    // --- Box: heap allocation, recursive data structure ---
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("boxed recursive list: {:?}, sum={}", list, sum_list(&list));

    // --- Deref: Box<T> behaves like &T ---
    let boxed = Box::new(41);
    println!("Deref lets Box act like the value: {}", *boxed + 1);

    // --- Rc: shared ownership, strong_count tracks how many owners ---
    let shared = Rc::new(String::from("shared data"));
    println!("strong_count after creation: {}", Rc::strong_count(&shared));
    let clone_a = Rc::clone(&shared); // bumps the counter, doesn't deep-copy
    let clone_b = Rc::clone(&shared);
    println!("strong_count after 2 clones: {}", Rc::strong_count(&shared));
    drop(clone_a);
    println!("strong_count after dropping one: {}", Rc::strong_count(&shared));
    println!("all clones see the same data: {}", clone_b);

    // --- Rc<RefCell<T>>: shared ownership + interior mutability ---
    let shared_counter = Rc::new(RefCell::new(0));
    let counter_a = Rc::clone(&shared_counter);
    let counter_b = Rc::clone(&shared_counter);
    *counter_a.borrow_mut() += 5; // mutate through a shared reference, checked at runtime
    *counter_b.borrow_mut() += 10;
    println!("Rc<RefCell<T>> shared mutable state: {}", shared_counter.borrow());
    // let bad = shared_counter.borrow_mut(); // <- while another borrow_mut() is alive this
    //                                            would panic at runtime: "already borrowed:
    //                                            BorrowMutError"

    // --- Drop order: reverse of declaration order ---
    let _first = Noisy("first");
    let _second = Noisy("second");
    let _third = Noisy("third");
    println!("about to leave main - watch the drop order below");

    // Interview notes:
    // - Box<T> costs one allocation and one pointer indirection; use it for recursive types or
    //   when a value is too large to move around by value.
    // - Rc<T> is single-threaded only (not Sync) - use Arc<T> across threads (see step 10).
    // - RefCell's runtime borrow check panics instead of failing to compile - it trades a
    //   compile-time guarantee for flexibility, so bugs surface later, at runtime.
}
