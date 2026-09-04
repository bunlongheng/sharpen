// Step 3: Classes and RAII - ctor/dtor order, resource release, rule of 3/5, const methods
// - RAII: acquire a resource in the constructor, release it in the destructor. The destructor
//   runs automatically when the object leaves scope - even on early return or a thrown exception.
// - Constructors run in declaration order (base first, then members top-to-bottom); destructors
//   run in the exact reverse order.
// - Member initializer lists initialize members directly (not default-construct then assign) -
//   faster, and required for const/reference members which cannot be assigned after construction.
// - Rule of 3: if you write a destructor, copy ctor, or copy assignment, you likely need all 3.
//   Rule of 5 adds move ctor and move assignment for classes that manage a resource.
// - const methods promise not to modify the object; the compiler enforces it, letting them be
//   called on const references/objects.

#include <iostream>
#include <string>

class Resource {
public:
    explicit Resource(std::string name) : name_(std::move(name)) {  // init list, not assignment
        std::cout << "  acquire: " << name_ << "\n";
    }
    ~Resource() { std::cout << "  release: " << name_ << "\n"; }    // runs no matter how we leave

    // const method: read-only, callable on a const Resource&
    const std::string& name() const { return name_; }

private:
    std::string name_;
};

// Demonstrates RAII releasing even on an early return - no manual cleanup needed.
void useResourceThenReturnEarly(bool bail) {
    Resource r("early-return-guard");
    if (bail) {
        std::cout << "  bailing out early, r still gets destroyed\n";
        return;  // r's destructor still runs here
    }
    std::cout << "  used r normally: " << r.name() << "\n";
}

int main() {
    std::cout << "-- construction/destruction order --\n";
    {
        Resource a("A");
        Resource b("B");
        std::cout << "  both alive: " << a.name() << ", " << b.name() << "\n";
    }  // destructors fire here in reverse order: B then A

    std::cout << "-- RAII on early return --\n";
    useResourceThenReturnEarly(true);

    std::cout << "-- const method --\n";
    const Resource c("const-owned");
    std::cout << "  c.name() via const ref: " << c.name() << "\n";

    return 0;
}

// Interview notes:
// - Destructor order is the reverse of construction order - this matters a lot when members
//   depend on each other (e.g. a logger member must outlive whatever logs to it in its dtor).
// - "Rule of 0" is the modern preference: hold resources via std::string/std::vector/smart
//   pointers so the compiler-generated special members are already correct, and you write none
//   of the rule-of-5 boilerplate yourself.
// - Forgetting the rule of 3/5 (e.g. a raw-pointer-owning class with only a default copy ctor)
//   causes a double-free: two objects both think they own and will delete the same resource.
