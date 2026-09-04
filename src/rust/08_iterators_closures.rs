// Step 8: Iterators & Closures - capture modes, Fn/FnMut/FnOnce, map/filter/collect, fold, laziness
// - A closure infers its capture mode from how it uses the environment: by &, by &mut, or by
//   value (move forces a move even if a reference would do, needed e.g. for threads).
// - Fn: can be called many times, only borrows. FnMut: can be called many times, mutates a
//   capture. FnOnce: can only be called once (it consumes a capture). Fn implies FnMut implies
//   FnOnce - the compiler picks the loosest trait a closure actually satisfies.
// - Iterator adapters (map, filter) are LAZY - nothing runs until a consumer (collect, sum, for)
//   pulls values through the chain.

fn apply<F: FnOnce() -> i32>(f: F) -> i32 { // takes any closure callable at least once
    f()
}

fn main() {
    // --- capture by reference ---
    let name = String::from("Nova");
    let print_name = || println!("captured by &: {}", name); // only reads -> borrows
    print_name();
    println!("name still usable after: {}", name);

    // --- capture by mutable reference ---
    let mut count = 0;
    let mut increment = || {
        count += 1;
    }; // mutates -> captures by &mut, closure binding itself must be mut
    increment();
    increment();
    println!("FnMut closure mutated count: {}", count);

    // --- capture by move ---
    let data = vec![1, 2, 3];
    let consume = move || println!("moved into closure: {:?}", data); // move: takes ownership
    consume();
    // println!("{:?}", data); // <- would fail: error[E0382]: borrow of moved value: `data`

    let x = 10;
    println!("FnOnce via apply(): {}", apply(move || x * 2));

    // --- laziness: nothing runs until collect/sum/for consumes the chain ---
    let nums = vec![1, 2, 3, 4, 5, 6];
    let iter = nums.iter().map(|n| n * n).filter(|n| n % 2 == 0); // builds a plan, runs nothing yet
    let evens_squared: Vec<i32> = iter.collect(); // NOW it actually runs
    println!("map().filter().collect(): {:?}", evens_squared);

    // --- fold: reduce to a single accumulated value ---
    let total = nums.iter().fold(0, |acc, n| acc + n);
    println!("fold sum: {}", total);

    // --- zip and enumerate ---
    let letters = ["a", "b", "c"];
    let indexed: Vec<(usize, &str)> = letters.iter().enumerate().map(|(i, l)| (i, *l)).collect();
    println!("enumerate: {:?}", indexed);
    let paired: Vec<(i32, &str)> = nums.iter().copied().zip(letters.iter().copied()).collect();
    println!("zip (stops at shorter): {:?}", paired);

    // Interview notes:
    // - Prefer the loosest trait bound your fn actually needs: FnOnce is the most permissive
    //   to require, Fn the most restrictive.
    // - Iterator laziness means intermediate collect()s are wasted allocations - chain adapters
    //   and collect once at the end.
    // - zip stops at the shorter of the two iterators - no panic, just truncation.
}
