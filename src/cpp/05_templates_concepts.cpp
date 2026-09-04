// Step 5: Templates and concepts - function/class templates, deduction, C++20 concepts
// - A function template is compiled once per distinct set of template arguments used ("template
//   instantiation") - the compiler generates real code for each type you actually call it with.
// - Class templates work the same way; std::vector<T> is itself a class template.
// - Template argument deduction lets the compiler infer T from the call arguments, so callers
//   rarely need to spell out myFunc<int>(x) explicitly.
// - A C++20 concept constrains a template parameter to types satisfying some requirement,
//   turning a cryptic template error into a clear "constraint not satisfied" message.
// - static_assert checks a condition at compile time and fails the build with a message if false
//   - useful for catching misuse of a template before it ever runs.

#include <concepts>
#include <iostream>
#include <string>

// --- function template ---
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

// --- class template ---
template <typename T>
class Box {
public:
    explicit Box(T value) : value_(value) {}
    const T& get() const { return value_; }
private:
    T value_;
};

// --- C++20 concept: constrain to integral types only ---
template <std::integral T>
T doubleIt(T value) {
    return value + value;
}

// static_assert catches a bad instantiation at compile time, not runtime.
static_assert(sizeof(int) >= 4, "this program assumes int is at least 32 bits");

int main() {
    // template argument deduction: no need to write maxOf<int>(3, 7)
    std::cout << "maxOf(3, 7) -> " << maxOf(3, 7) << "\n";
    std::cout << "maxOf(2.5, 1.1) -> " << maxOf(2.5, 1.1) << "\n";
    std::cout << "maxOf(std::string) -> " << maxOf(std::string("abc"), std::string("abd")) << "\n";

    Box<int> intBox(42);
    Box<std::string> strBox("templated box");
    std::cout << "Box<int>.get() -> " << intBox.get() << "\n";
    std::cout << "Box<std::string>.get() -> " << strBox.get() << "\n";

    std::cout << "doubleIt(21) [int satisfies std::integral] -> " << doubleIt(21) << "\n";
    // doubleIt(2.5);  // <- would fail to compile: "constraints not satisfied ... double does not
    //                    satisfy std::integral" - the concept rejects it before overload resolution
    //                    even gets to a confusing error deep inside the function body.

    return 0;
}

// Interview notes:
// - Templates are compile-time polymorphism (monomorphized: one specialized copy of code per
//   type), unlike virtual functions which resolve at runtime through a vtable.
// - Concepts move a type error from "500 lines of template-internal gibberish" to a one-line
//   "T must satisfy std::integral" - a huge readability win introduced in C++20.
// - static_assert with no matching runtime cost is preferred over a runtime check whenever the
//   condition is knowable at compile time.
