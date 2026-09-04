// Step 7: Maps and sets - std::map, unordered_map, set, structured bindings, contains()
// - std::map is a balanced binary search tree keyed by operator<: iteration is always in sorted
//   key order, insert/find/erase are O(log n).
// - std::unordered_map is a hash table: O(1) average lookup, but NO guaranteed iteration order -
//   copy entries into a sorted container (e.g. std::map) before printing for deterministic output.
// - std::set is the "keys only" sibling of map: sorted, unique, O(log n) operations.
// - Structured bindings (auto [k, v] : m) unpack a pair/tuple-like value without .first/.second.
// - operator[] on a map INSERTS a default-constructed value if the key is missing (a common
//   pitfall when you only meant to read); insert() and contains() (C++20) never do that.

#include <iostream>
#include <map>
#include <set>
#include <string>
#include <unordered_map>

int main() {
    // --- std::map: sorted iteration ---
    std::map<std::string, int> scores{{"charlie", 70}, {"alice", 95}, {"bob", 82}};
    std::cout << "std::map iterates in sorted key order:\n";
    for (const auto& [name, score] : scores) {  // structured bindings
        std::cout << "  " << name << ": " << score << "\n";
    }

    // --- unordered_map: sort before printing for determinism ---
    std::unordered_map<std::string, int> hashScores{{"zeta", 3}, {"alpha", 1}, {"mu", 2}};
    std::map<std::string, int> sortedView(hashScores.begin(), hashScores.end());  // copy, then sort
    std::cout << "unordered_map contents (copied into a map to sort before printing):\n";
    for (const auto& [name, score] : sortedView) {
        std::cout << "  " << name << ": " << score << "\n";
    }

    // --- insert() vs operator[] pitfall ---
    std::map<std::string, int> counts;
    counts["fresh"];  // operator[]: inserts {"fresh", 0} even though we never assigned a value!
    std::cout << "operator[] auto-inserted a default 0: counts.size()=" << counts.size()
              << ", counts[\"fresh\"]=" << counts["fresh"] << "\n";
    auto [it, inserted] = counts.insert({"fresh", 99});  // insert() never overwrites an existing key
    std::cout << "insert() on existing key: inserted=" << (inserted ? "true" : "false")
              << ", value stays " << it->second << "\n";

    // --- contains() (C++20): check membership without inserting ---
    std::cout << "counts.contains(\"fresh\") -> " << (counts.contains("fresh") ? "true" : "false")
              << ", counts.contains(\"missing\") -> "
              << (counts.contains("missing") ? "true" : "false") << "\n";

    // --- std::set: sorted, unique ---
    std::set<int> ids{5, 1, 3, 1, 5, 2};  // duplicates collapse automatically
    std::cout << "std::set dedupes and sorts:";
    for (int id : ids) std::cout << " " << id;
    std::cout << "\n";

    return 0;
}

// Interview notes:
// - "map[key] for a read-only lookup" is a classic bug: it silently inserts a default value,
//   growing the map and hiding a typo'd key instead of signaling "not found".
// - Before C++20's contains(), the idiom was `m.find(key) != m.end()` - contains() is clearer
//   and equally O(log n)/O(1).
// - unordered_map's iteration order can change between runs/inserts - never rely on it for
//   deterministic output or hashing-dependent logic.
