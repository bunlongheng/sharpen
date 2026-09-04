// Step 4: Smart pointers - unique_ptr, shared_ptr, weak_ptr, why not raw new/delete
// - Raw new/delete puts ownership and cleanup entirely on the programmer - miss one path
//   (early return, exception) and you leak, or double-free if two owners both call delete.
// - std::unique_ptr is move-only: exactly one owner at a time. Copying is a compile error by
//   design, which is exactly what "move-only" enforces.
// - std::shared_ptr uses atomic reference counting; use_count() shows how many owners are alive.
//   The resource is freed when the last owner is destroyed.
// - std::weak_ptr observes a shared_ptr without owning it (doesn't bump the count) - the classic
//   fix for a reference cycle that would otherwise leak two shared_ptrs holding each other alive.

#include <iostream>
#include <memory>

struct Widget {
    int id;
    explicit Widget(int i) : id(i) { std::cout << "  Widget " << id << " constructed\n"; }
    ~Widget() { std::cout << "  Widget " << id << " destroyed\n"; }
};

// A cycle: Parent holds a shared_ptr to Child, Child holds a shared_ptr back to Parent.
// Neither use_count ever reaches 0, so neither destructor ever runs - a real memory leak.
struct Child;
struct Parent {
    std::shared_ptr<Child> child;
    ~Parent() { std::cout << "  Parent destroyed\n"; }
};
struct Child {
    std::weak_ptr<Parent> parent;  // weak_ptr breaks the cycle: doesn't keep Parent alive
    ~Child() { std::cout << "  Child destroyed\n"; }
};

int main() {
    // --- unique_ptr: single owner, move-only ---
    std::cout << "-- unique_ptr --\n";
    auto up1 = std::make_unique<Widget>(1);
    auto up2 = std::move(up1);  // ownership transfers; up1 is now null
    std::cout << "  up1 is null after move? " << (up1 == nullptr ? "true" : "false") << "\n";
    std::cout << "  up2 owns id=" << up2->id << "\n";
    // auto up3 = up2;  // <- would fail to compile: "call to implicitly-deleted copy constructor
    //                     of 'std::unique_ptr<Widget>'" - unique_ptr has no copy ctor on purpose.

    // --- shared_ptr: reference-counted shared ownership ---
    std::cout << "-- shared_ptr --\n";
    auto sp1 = std::make_shared<Widget>(2);
    std::cout << "  use_count after creation: " << sp1.use_count() << "\n";
    {
        auto sp2 = sp1;  // copy: bumps the count, both point at the same Widget
        std::cout << "  use_count with second owner: " << sp1.use_count() << "\n";
    }  // sp2 destroyed here, count drops back down
    std::cout << "  use_count after sp2 scope ends: " << sp1.use_count() << "\n";

    // --- weak_ptr breaking a cycle ---
    std::cout << "-- weak_ptr breaking a cycle --\n";
    {
        auto parent = std::make_shared<Parent>();
        auto child = std::make_shared<Child>();
        parent->child = child;      // shared_ptr: Parent owns Child
        child->parent = parent;     // weak_ptr: Child observes Parent without owning it
        std::cout << "  parent use_count=" << parent.use_count()
                  << " child use_count=" << child.use_count() << "\n";
    }  // both shared_ptrs go out of scope -> counts hit 0 -> both destructors run, no leak

    if (auto locked = std::weak_ptr<Widget>{}.lock(); !locked) {
        std::cout << "  locking an empty weak_ptr yields a null shared_ptr, as expected\n";
    }

    return 0;
}

// Interview notes:
// - Raw new/delete requires manual bookkeeping on every code path; smart pointers tie lifetime
//   to scope (RAII) so leaks and double-frees become compile-time-prevented or automatic.
// - unique_ptr being move-only is exactly what makes it zero-overhead: no atomic refcount needed.
// - A shared_ptr cycle (A -> shared -> B -> shared -> A) is a genuine leak; break it by making
//   one direction a weak_ptr, typically the "back" or "parent" pointer.
