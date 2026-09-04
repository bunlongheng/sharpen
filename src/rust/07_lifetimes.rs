// Step 7: Lifetimes - why they exist, fn longest<'a>, structs holding references, elision, 'static
// - Lifetimes are compile-time-only annotations that describe how long a reference is valid;
//   they exist so the borrow checker can reject dangling references before the program runs.
// - fn longest<'a>(x: &'a str, y: &'a str) -> &'a str says: the returned reference lives at
//   most as long as the SHORTER of the two inputs - it's a contract, not a control over lifetime.
// - A struct holding a reference must be annotated with a lifetime so it can't outlive the data.
// - Elision rules let you omit lifetimes in common cases: each &param gets its own lifetime, and
//   if there's exactly one input reference (or a &self), the output reuses that lifetime.
// - 'static means the reference is valid for the entire program (e.g. string literals).

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() {
        x
    } else {
        y
    }
}

struct Excerpt<'a> {
    text: &'a str, // this struct can't outlive the string it borrows from
}

impl<'a> Excerpt<'a> {
    fn first_word(&self) -> &str { // elided: output lifetime reuses &self's lifetime
        self.text.split_whitespace().next().unwrap_or("")
    }
}

fn main() {
    let s1 = String::from("hello");
    let result;
    {
        let s2 = String::from("world!!"); // longer, but goes out of scope below
        result = longest(&s1, &s2);
        println!("longest inside inner scope: {}", result); // fine: s2 still alive here
    }
    // println!("{}", result); // <- would fail out here: error[E0597]: `s2` does not live long
    //                             enough (result could be borrowing s2, which just dropped)

    let novel = String::from("Call me Ishmael. Some years ago...");
    let excerpt = Excerpt { text: &novel[0..15] };
    println!("Excerpt::first_word: {}", excerpt.first_word());

    // --- 'static: lives for the whole program ---
    let static_str: &'static str = "I live forever"; // string literals are baked into the binary
    println!("'static reference: {}", static_str);

    // --- elision in practice: no lifetime annotation needed here ---
    fn first_char(s: &str) -> Option<char> { // one input ref -> output borrows from it, elided
        s.chars().next()
    }
    println!("elided lifetime, still borrow-checked: {:?}", first_char("rust"));

    // Interview notes:
    // - Lifetimes don't change how long a value lives - they just let the compiler PROVE a
    //   reference never outlives its data, all at compile time with zero runtime cost.
    // - 'a in longest<'a> means "pick the shorter of x and y's lifetimes for the output" -
    //   the function doesn't extend anything's lifetime, it just describes the constraint.
    // - Structs holding references almost always need an explicit lifetime parameter because
    //   the compiler can't guess which field the elision rules should apply to.
}
