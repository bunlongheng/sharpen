// Step 2: Strings and vectors - std::string ops, std::vector, std::array, iterators
// - std::string supports find/substr/+= like most languages' string types, but find() returns
//   std::string::npos (not -1) when nothing is found.
// - std::vector grows dynamically; size() is elements currently held, capacity() is the
//   allocated buffer - they diverge on purpose to amortize reallocation cost.
// - emplace_back constructs the element in place (no temporary + move); push_back needs an
//   already-built object. For simple types the difference is invisible but interviewers ask.
// - operator[] does no bounds checking (undefined behavior on out-of-range); at() throws
//   std::out_of_range - use at() when input is untrusted, [] in hot loops you've already checked.
// - std::array is a fixed-size, stack-allocated array with vector-like syntax; size is
//   compile-time, no dynamic growth.

#include <array>
#include <iostream>
#include <string>
#include <vector>

int main() {
    // --- std::string ops ---
    std::string s = "brushup interview practice";
    auto pos = s.find("interview");
    std::cout << "find(\"interview\") -> " << pos << "\n";
    std::cout << "substr(0,8) -> " << s.substr(0, 8) << "\n";
    s += " app";
    std::cout << "after += \" app\": " << s << "\n";
    auto missing = s.find("xyz");
    std::cout << "find missing == npos? " << (missing == std::string::npos ? "true" : "false") << "\n";

    // --- std::vector: push_back vs emplace_back, size vs capacity ---
    std::vector<int> v;
    std::cout << "empty vector: size=" << v.size() << " capacity=" << v.capacity() << "\n";
    v.push_back(10);            // copies/moves an already-built int
    v.emplace_back(20);         // constructs 20 directly in place
    v.push_back(30);
    std::cout << "after 3 inserts: size=" << v.size() << " capacity>=size? "
              << (v.capacity() >= v.size() ? "true" : "false") << "\n";

    // range-for: read-only view of each element
    int sum = 0;
    for (const auto& n : v) sum += n;
    std::cout << "range-for sum=" << sum << "\n";

    // at() vs []: at() bounds-checks and throws, [] does not
    std::cout << "v.at(1)=" << v.at(1) << " v[1]=" << v[1] << "\n";
    try {
        v.at(99);  // out of range -> throws std::out_of_range
    } catch (const std::out_of_range& e) {
        std::cout << "v.at(99) threw out_of_range: " << e.what() << "\n";
    }
    // v[99] would NOT throw - it's undefined behavior, silently reading garbage. Never do this.

    // --- std::array: fixed size, known at compile time ---
    std::array<int, 4> arr{1, 2, 3, 4};
    std::cout << "std::array size=" << arr.size() << " sum via iterators=";
    int arrSum = 0;
    for (auto it = arr.begin(); it != arr.end(); ++it) arrSum += *it;  // explicit iterators
    std::cout << arrSum << "\n";

    return 0;
}

// Interview notes:
// - std::string::find returning npos (a huge unsigned sentinel) instead of -1 is a classic trap:
//   comparing "if (pos < 0)" never fires because pos is unsigned.
// - capacity() only ever grows (usually doubling) as you push_back; it never shrinks on its own -
//   use shrink_to_fit() if you actually need memory back.
// - Prefer at() at API boundaries with untrusted indices, [] once bounds are already guaranteed.
