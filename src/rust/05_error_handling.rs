// Step 5: Error Handling - Result, ? operator, custom errors, map_err, unwrap_or_else, panics
// - Result<T, E> is the recoverable-error type: Ok(value) or Err(error), checked at compile time.
// - The ? operator returns early with Err(e) if the expression is an Err, otherwise unwraps the
//   Ok value - replaces manual match-and-return boilerplate.
// - A custom error enum implementing Display gives callers a typed, matchable error.
// - map_err transforms the Err variant without touching Ok; unwrap_or_else supplies a fallback
//   computed from the error instead of panicking.
// - panic! is for unrecoverable bugs (contract violations); Result is for expected failure modes.

use std::fmt;

#[derive(Debug)]
enum ParseAgeError {
    NotANumber(String),
    Negative(i32),
}

impl fmt::Display for ParseAgeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ParseAgeError::NotANumber(s) => write!(f, "'{}' is not a valid number", s),
            ParseAgeError::Negative(n) => write!(f, "age cannot be negative: {}", n),
        }
    }
}

fn parse_age(input: &str) -> Result<i32, ParseAgeError> {
    let n: i32 = input
        .parse::<i32>()
        .map_err(|_| ParseAgeError::NotANumber(input.to_string()))?; // ? bails out on Err
    if n < 0 {
        return Err(ParseAgeError::Negative(n));
    }
    Ok(n)
}

fn describe_age(input: &str) -> Result<String, ParseAgeError> {
    let age = parse_age(input)?; // propagate error to caller instead of handling it here
    Ok(format!("age is {}", age))
}

fn main() {
    for input in ["30", "-5", "abc"] {
        match describe_age(input) {
            Ok(msg) => println!("{:?} -> Ok: {}", input, msg),
            Err(e) => println!("{:?} -> Err: {}", input, e), // uses our Display impl
        }
    }

    // --- unwrap_or_else: fallback computed from the error ---
    let fallback = parse_age("nope").unwrap_or_else(|e| {
        println!("recovering from error: {}", e);
        0
    });
    println!("fallback value: {}", fallback);

    // --- unwrap/expect panic on Err; only reach for them when Err is truly impossible ---
    let safe: i32 = "42".parse().expect("literal '42' always parses");
    println!("expect on a known-good value: {}", safe);
    // let boom: i32 = "abc".parse().unwrap(); // <- would panic: called `Result::unwrap()` on an
    //                                            `Err` value: ParseIntError { kind: InvalidDigit }

    // Interview notes:
    // - Prefer Result + ? over unwrap() in library code; reserve panic! for bugs, not bad input.
    // - map_err lets you convert a low-level error (ParseIntError) into your own domain error type.
    // - A custom error implementing std::error::Error + Display composes with `?` across functions.
}
