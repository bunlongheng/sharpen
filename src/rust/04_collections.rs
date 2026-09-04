// Step 4: Collections - Vec, String vs &str, HashMap entry API, HashSet, sorted iteration
// - Vec<T> is a growable, heap-allocated array; push/iter/sort/dedup cover the common operations.
// - String is an owned, growable UTF-8 buffer; &str is a borrowed view into UTF-8 text (a slice).
// - HashMap's entry API (entry().or_insert()) inserts-if-missing and updates in one lookup,
//   avoiding a separate contains_key + insert (double hashing).
// - HashSet dedupes and supports set algebra like Python's set.
// - HashMap iteration order is NOT guaranteed - sort keys before printing for deterministic output.

use std::collections::{HashMap, HashSet};

fn main() {
    // --- Vec ---
    let mut nums = vec![3, 1, 4, 1, 5];
    nums.push(9);
    println!("vec after push: {:?}", nums);
    let sum: i32 = nums.iter().sum();
    println!("iter().sum(): {}", sum);
    nums.sort();
    println!("after sort: {:?}", nums);
    nums.dedup(); // dedup only removes CONSECUTIVE duplicates, so sort first
    println!("after dedup (needs sort first): {:?}", nums);

    // --- String vs &str ---
    let mut owned = String::from("hello");
    owned.push_str(", world"); // only String can grow; &str is immutable and borrowed
    let shout = format!("{}!", owned.to_uppercase());
    println!("owned String: {}", owned);
    println!("format! builds a new String: {}", shout);
    let borrowed: &str = &owned; // String derefs to &str for free
    println!("borrowed as &str: {}", borrowed);
    let letters: Vec<char> = "abc".chars().collect(); // chars() iterates Unicode scalar values
    println!("chars(): {:?}", letters);
    // let byte = owned[0]; // <- would fail: error[E0277]: the type `String` cannot be indexed
    //                          by `{integer}` (indexing is ambiguous over UTF-8 bytes vs chars)

    // --- HashMap entry API ---
    let mut scores: HashMap<&str, i32> = HashMap::new();
    scores.insert("alice", 10);
    *scores.entry("alice").or_insert(0) += 5; // key exists: adds to it
    *scores.entry("bob").or_insert(0) += 5; // key missing: inserts 0, then adds
    let mut entries: Vec<(&&str, &i32)> = scores.iter().collect();
    entries.sort(); // HashMap order is unspecified - sort before printing
    println!("HashMap sorted entries: {:?}", entries);

    // --- HashSet ---
    let a_set: HashSet<i32> = HashSet::from([1, 2, 3]);
    let b_set: HashSet<i32> = HashSet::from([2, 3, 4]);
    let mut inter: Vec<&i32> = a_set.intersection(&b_set).collect();
    inter.sort();
    println!("HashSet intersection (sorted): {:?}", inter);

    // Interview notes:
    // - Vec::dedup only collapses adjacent duplicates - always sort first if you want full dedup.
    // - String is UTF-8, so indexing by byte position could split a multi-byte character; Rust
    //   forces you to use slicing (which panics on a bad boundary) or .chars() instead.
    // - Never rely on HashMap/HashSet iteration order across runs - sort keys for stable output.
}
