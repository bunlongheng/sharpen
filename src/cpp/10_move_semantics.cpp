// Step 10: Move semantics - lvalue vs rvalue, std::move, move ctor, forwarding, RVO
// - An lvalue names a persisting object (has an address you could take); an rvalue is a
//   temporary about to be destroyed (a literal, a function's by-value return, std::move's result).
// - std::move doesn't move anything itself - it's just a cast to an rvalue reference (T&&) that
//   tells the compiler "treat this as disposable, moving out of it is safe."
// - A move constructor steals another object's internal resources (pointer/buffer) instead of
//   copying them, then leaves the source in a valid-but-unspecified ("moved-from") state.
// - Perfect forwarding (std::forward inside a template taking T&&) preserves whether the caller's
//   argument was an lvalue or rvalue when passing it along, so no unnecessary copies are forced.
// - RVO/copy elision lets the compiler build a returned local directly in the caller's storage,
//   skipping the move (or copy) entirely - since C++17 this is guaranteed for prvalues.

#include <iostream>
#include <string>
#include <utility>

class Buffer {
public:
    explicit Buffer(std::string label) : label_(std::move(label)) {
        std::cout << "  Buffer(\"" << label_ << "\") constructed\n";
    }

    // Move constructor: steal the source's data, leave it empty (moved-from state).
    Buffer(Buffer&& other) noexcept : label_(std::move(other.label_)) {
        other.label_ = "";  // moved-from string is left explicitly empty, not garbage
        std::cout << "  Buffer move-constructed, source now: \"" << other.label_ << "\"\n";
    }

    // Copy constructor: for contrast with the move ctor above.
    Buffer(const Buffer& other) : label_(other.label_) {
        std::cout << "  Buffer copy-constructed from \"" << other.label_ << "\"\n";
    }

    const std::string& label() const { return label_; }

private:
    std::string label_;
};

// Perfect forwarding: T&& here is a "forwarding reference" (not a plain rvalue ref) because T
// is deduced. std::forward preserves the caller's original value category.
template <typename T>
Buffer makeBuffer(T&& label) {
    return Buffer(std::forward<T>(label));
}

// Returning a local by value: since C++17 this prvalue is guaranteed-elided (built directly
// in the caller's slot), so this is NOT a move in practice - RVO applies even before any ctor runs.
Buffer buildNamed() {
    return Buffer("built-in-place");
}

int main() {
    // --- lvalue vs rvalue, copy ctor vs move ctor ---
    Buffer original("lvalue-owned");   // original is an lvalue: it has a name, an address
    Buffer copied(original);            // lvalue argument -> binds to Buffer(const Buffer&)
    std::cout << "  after copy ctor, original still: \"" << original.label() << "\"\n";

    // --- std::move: explicit cast to rvalue reference ---
    Buffer moved(std::move(original));  // std::move casts original to Buffer&&, selects the move ctor
    std::cout << "  after std::move, original is now: \"" << original.label() << "\" (moved-from, empty)\n";

    // --- perfect forwarding ---
    Buffer forwarded = makeBuffer(std::string("forwarded-temp"));  // forwarded as an rvalue
    std::cout << "  forwarded buffer label: \"" << forwarded.label() << "\"\n";

    // --- RVO ---
    Buffer built = buildNamed();  // compiler elides the move; built IS the local inside buildNamed
    std::cout << "  RVO-built buffer label: \"" << built.label() << "\"\n";

    return 0;
}

// Interview notes:
// - std::move is a cast, not an action - the actual "moving" happens inside whatever constructor
//   or assignment operator the rvalue reference selects.
// - A moved-from object must remain valid (destructible, assignable) but its VALUE is unspecified
//   - printing it is legal but you should never rely on its old contents.
// - Guaranteed copy elision (C++17) means `return Buffer(...)` from a function often calls neither
//   the move nor copy constructor at all - a frequent point of confusion in "how many times does
//   the move ctor run" interview questions.
