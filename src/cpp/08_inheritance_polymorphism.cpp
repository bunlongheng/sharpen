// Step 8: Inheritance and polymorphism - virtual, override, abstract base, vector<unique_ptr<Base>>
// - A virtual function is resolved at runtime through a vtable based on the object's actual type,
//   not the static type of the pointer/reference holding it - that's dynamic dispatch.
// - override tells the compiler "this must match a virtual in the base" - catches typos in the
//   signature (wrong params/const-ness) as a compile error instead of silently adding a new,
//   unrelated overload.
// - A pure virtual function (`= 0`) makes the class abstract: it cannot be instantiated, and
//   every concrete subclass must implement it.
// - std::vector<std::unique_ptr<Base>> is the idiomatic way to store a heterogeneous collection
//   of polymorphic objects with clear, automatic ownership.
// - A base class destructor MUST be virtual if you ever delete through a base pointer - otherwise
//   only the base's destructor runs and the derived part leaks (undefined behavior technically).

#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;             // virtual dtor: required for safe polymorphic deletion
    virtual double area() const = 0;        // pure virtual: makes Shape abstract
    virtual std::string name() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double radius) : radius_(radius) {}
    double area() const override { return 3.14159 * radius_ * radius_; }  // override checked by compiler
    std::string name() const override { return "Circle"; }
private:
    double radius_;
};

class Square : public Shape {
public:
    explicit Square(double side) : side_(side) {}
    double area() const override { return side_ * side_; }
    std::string name() const override { return "Square"; }
private:
    double side_;
};

// Takes a Shape& - dynamic dispatch picks the right area()/name() for whatever was passed.
void describe(const Shape& shape) {
    std::cout << "  " << shape.name() << " area=" << shape.area() << "\n";
}

int main() {
    // Shape shape;  // <- would fail to compile: "cannot declare variable to be of abstract type
    //                  'Shape'" because area()/name() are pure virtual (=0).

    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(2.0));
    shapes.push_back(std::make_unique<Square>(3.0));

    std::cout << "-- dynamic dispatch through Shape& --\n";
    for (const auto& s : shapes) {
        describe(*s);  // calls Circle::area() or Square::area() based on the real object
    }

    // --- object slicing mistake ---
    // Copying a derived object INTO a base-by-value variable "slices" off the derived part,
    // losing the vtable override and any derived-only members:
    //   Circle c(5.0);
    //   Shape sliced = c;         // WRONG: slices Circle down to just its Shape base subobject
    //   sliced.area();            // calls Shape's (pure virtual - wouldn't even compile here,
    //                              // but with a non-abstract base this silently calls the BASE
    //                              // version, not Circle's, even though `c` was a Circle).
    // Fix: always hold/pass polymorphic types via pointer or reference, never by value.
    std::cout << "-- object slicing avoided by using pointers/references, not by-value copies --\n";

    return 0;
}

// Interview notes:
// - Vtable dispatch has a small runtime cost (one indirect call) vs a direct call - the price of
//   runtime polymorphism, and usually irrelevant next to the flexibility it buys.
// - A missing virtual destructor on a base class that's deleted via a base pointer is a genuine,
//   common production bug - it compiles cleanly and only breaks at runtime (derived cleanup skipped).
// - "override" isn't required by the language, but omitting it throws away free compiler checking
//   of your virtual function signature - always write it.
