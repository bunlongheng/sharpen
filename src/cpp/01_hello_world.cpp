// Step 1: Hello World - iostream, auto, references, const, init, strings
// - iostream's std::cout/std::cin are type-safe stream operators, no format-string mismatches.
// - auto deduces the type from the initializer; it never means "no type", just "inferred type".
// - A reference (T&) is an alias to an existing object - no copy is made, unlike passing by value.
// - const on a variable/parameter means "cannot be modified through this name" - prefer it by
//   default so the compiler catches accidental mutation.
// - Uniform initialization ({}) works for any type and blocks narrowing conversions (e.g. double
//   truncated to int), unlike the older ( ) or = forms.
// - constexpr values are computed at compile time when possible, not just "const".

#include <iostream>
#include <string>

// A function taking by value makes a copy; taking by const& avoids the copy but still forbids
// modification. For small types like int, pass by value is fine; for std::string, prefer const&.
void printCopy(std::string s) { s += "!"; }          // modifies its own local copy only
void printRef(const std::string& s) { std::cout << s << " (len " << s.size() << ")\n"; }

int main() {
    // --- auto ---
    auto count = 3;          // deduced as int
    auto pi = 3.14159;       // deduced as double
    std::cout << "auto count=" << count << " pi=" << pi << "\n";

    // --- uniform initialization blocks narrowing ---
    int exact{42};            // fine
    // int bad{3.9};          // <- would fail to compile: narrowing double to int is not allowed
    std::cout << "uniform init exact=" << exact << "\n";

    // --- const ---
    const int maxRetries = 5;
    std::cout << "const maxRetries=" << maxRetries << "\n";

    // --- constexpr: evaluated at compile time ---
    constexpr int squareOf7 = 7 * 7;
    std::cout << "constexpr squareOf7=" << squareOf7 << "\n";

    // --- references vs copies ---
    std::string name = "Brush Up";
    std::string& nameRef = name;   // nameRef IS name, not a copy
    nameRef += " App";             // mutates the original through the reference
    std::cout << "reference mutation seen via name: " << name << "\n";

    std::string original = "kept";
    printCopy(original);           // pass by value: original is untouched
    std::cout << "after printCopy, original still: " << original << "\n";
    printRef(original);            // pass by const&: no copy, read-only

    // --- std::string basics ---
    std::string greeting = "Hello";
    greeting += ", world";         // concatenation
    std::cout << "std::string: " << greeting << ", size=" << greeting.size() << "\n";

    return 0;
}

// Interview notes:
// - "auto" is resolved at compile time from the initializer; it is not dynamic typing.
// - Prefer const T& parameters for anything larger than a couple of machine words to avoid
//   copies, but a plain T is simpler and fine for cheap types like int/double/bool.
// - {} initialization catching narrowing conversions is a favorite "spot the bug" question.
