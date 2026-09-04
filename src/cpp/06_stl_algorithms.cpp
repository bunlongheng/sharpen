// Step 6: STL algorithms - sort, find_if, count_if, accumulate, transform, erase-remove, ranges
// - <algorithm> functions operate on iterator ranges [begin, end), keeping the "what" (the
//   operation) separate from the "how" (the container), so they work across vector/array/etc.
// - A lambda [captures](params){body} is a small inline callable - the natural fit for a
//   comparator or predicate passed to an algorithm.
// - std::accumulate (from <numeric>) folds a range into one value; std::transform maps a range
//   into another, elementwise.
// - The pre-C++20 erase-remove idiom (std::remove + container::erase) is required because
//   remove() cannot resize the container itself - it just shuffles survivors to the front and
//   returns a new logical end, leaving "removed" elements at the tail. C++20's std::erase_if
//   does both steps in one call.
// - std::ranges::sort (C++20) takes the container directly - no more spelling out .begin()/.end().

#include <algorithm>
#include <iostream>
#include <numeric>
#include <ranges>
#include <vector>

int main() {
    std::vector<int> nums{5, 3, 8, 1, 9, 2};

    // sort with a lambda comparator (descending)
    std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
    std::cout << "sorted descending:";
    for (int n : nums) std::cout << " " << n;
    std::cout << "\n";

    // find_if: first element matching a predicate
    auto it = std::find_if(nums.begin(), nums.end(), [](int n) { return n < 5; });
    std::cout << "find_if first <5 -> " << (it != nums.end() ? *it : -1) << "\n";

    // count_if: how many satisfy a predicate
    auto evenCount = std::count_if(nums.begin(), nums.end(), [](int n) { return n % 2 == 0; });
    std::cout << "count_if even -> " << evenCount << "\n";

    // accumulate: fold into a single sum (starting value 0)
    int total = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "accumulate sum -> " << total << "\n";

    // transform: elementwise map into a new vector
    std::vector<int> squared(nums.size());
    std::transform(nums.begin(), nums.end(), squared.begin(), [](int n) { return n * n; });
    std::cout << "transform squared:";
    for (int n : squared) std::cout << " " << n;
    std::cout << "\n";

    // all_of / any_of
    bool allPositive = std::all_of(nums.begin(), nums.end(), [](int n) { return n > 0; });
    bool anyOver8 = std::any_of(nums.begin(), nums.end(), [](int n) { return n > 8; });
    std::cout << "all_of >0: " << (allPositive ? "true" : "false")
              << ", any_of >8: " << (anyOver8 ? "true" : "false") << "\n";

    // erase-remove idiom: remove() shuffles, then erase() actually shrinks the container
    std::vector<int> withDupes{1, 2, 2, 3, 2, 4};
    withDupes.erase(std::remove(withDupes.begin(), withDupes.end(), 2), withDupes.end());
    std::cout << "erase-remove idiom (drop all 2s):";
    for (int n : withDupes) std::cout << " " << n;
    std::cout << "\n";

    // C++20 std::erase_if: same result, one call, no dangling "logical end" to reason about
    std::vector<int> withDupes2{1, 2, 2, 3, 2, 4};
    std::erase_if(withDupes2, [](int n) { return n == 2; });
    std::cout << "std::erase_if (C++20, drop all 2s):";
    for (int n : withDupes2) std::cout << " " << n;
    std::cout << "\n";

    // ranges::sort: pass the container directly, no begin()/end()
    std::vector<int> rangeSorted{4, 2, 7, 1};
    std::ranges::sort(rangeSorted);
    std::cout << "ranges::sort:";
    for (int n : rangeSorted) std::cout << " " << n;
    std::cout << "\n";

    return 0;
}

// Interview notes:
// - std::remove doesn't shrink the container - it's a common interview gotcha to call remove()
//   alone and expect the vector to be shorter; you must also call erase() (or use erase_if).
// - accumulate's third argument sets both the starting value AND the result type - accumulate
//   with 0 on a vector<double> silently truncates to int, another classic trap.
// - Prefer std::ranges algorithms in new C++20 code: less boilerplate, and they compose with
//   views/pipelines.
