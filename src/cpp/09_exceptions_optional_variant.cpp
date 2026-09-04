// Step 9: Exceptions, optional, variant - try/catch, custom exceptions, noexcept, visit
// - Catch exceptions by const reference (`catch (const std::exception& e)`) to avoid slicing a
//   derived exception type down to its base and to avoid an unnecessary copy.
// - A custom exception typically derives from std::runtime_error and overrides what() to
//   describe the failure.
// - noexcept documents (and lets the compiler optimize around) a function that promises never to
//   throw; if it throws anyway, std::terminate is called immediately - no unwinding.
// - std::optional<T> represents "a T, or nothing" without null pointers or sentinel values.
// - std::variant<Ts...> is a type-safe tagged union; std::visit dispatches a callable over
//   whichever alternative is currently held.

#include <exception>
#include <iostream>
#include <optional>
#include <string>
#include <variant>
#include <vector>

// Custom exception: derive from std::runtime_error, add context in what().
class InsufficientFundsError : public std::runtime_error {
public:
    explicit InsufficientFundsError(double shortfall)
        : std::runtime_error("insufficient funds"), shortfall_(shortfall) {}
    double shortfall() const { return shortfall_; }
private:
    double shortfall_;
};

void withdraw(double balance, double amount) {
    if (amount > balance) throw InsufficientFundsError(amount - balance);
    std::cout << "  withdrew " << amount << ", remaining " << (balance - amount) << "\n";
}

int safeAdd(int a, int b) noexcept { return a + b; }  // promises never to throw

// std::optional: "found or not", no sentinel value needed.
std::optional<int> findFirstEven(const std::vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return std::nullopt;  // explicitly "no value"
}

int main() {
    std::cout << "-- exceptions --\n";
    try {
        withdraw(100.0, 150.0);
    } catch (const InsufficientFundsError& e) {  // catch by const& - no slicing, no copy
        std::cout << "  caught: " << e.what() << ", shortfall=" << e.shortfall() << "\n";
    }
    std::cout << "noexcept safeAdd(2,3) -> " << safeAdd(2, 3) << "\n";

    std::cout << "-- optional --\n";
    std::vector<int> odds{1, 3, 5};
    std::vector<int> mixed{1, 3, 4, 5};
    if (auto found = findFirstEven(mixed)) {  // implicit bool conversion: has_value()
        std::cout << "  found even in mixed: " << *found << "\n";
    }
    auto none = findFirstEven(odds);
    std::cout << "  found even in odds? " << (none.has_value() ? "true" : "false")
              << ", value_or(-1)=" << none.value_or(-1) << "\n";

    std::cout << "-- variant --\n";
    std::variant<int, std::string> v = 42;
    auto describe = [](const auto& value) { std::cout << "  variant holds: " << value << "\n"; };
    std::visit(describe, v);   // dispatches to the int alternative
    v = std::string("now a string");
    std::visit(describe, v);   // dispatches to the string alternative
    std::cout << "  variant index() -> " << v.index() << " (0=int, 1=string)\n";

    // std::expected<T, E> (C++23) is the natural next step: it carries either a value OR an
    // error object (not just presence/absence), avoiding exceptions for expected-failure paths -
    // not used here since this build targets C++20.

    return 0;
}

// Interview notes:
// - Catching by value slices a derived exception to its base and copies it twice (throw + catch)
//   - always catch by const reference.
// - noexcept functions that throw anyway call std::terminate immediately, bypassing normal stack
//   unwinding - only mark a function noexcept if you're certain it can't throw.
// - optional/variant push "missing value" and "one-of-several-types" bugs into the type system,
//   catching them at compile time instead of via null pointers or unsafe unions.
