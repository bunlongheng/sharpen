// Step 6: Structs, Enums, Unions - struct, typedef, nesting, copy semantics, tagged union
// - A struct groups related fields; typedef gives the struct type a shorter usable name.
// - Assigning one struct to another copies every field (a full value copy); passing a pointer
//   instead lets a function see/mutate the caller's original struct without copying it.
// - enum values are just named ints starting at 0 by default (or whatever you assign).
// - A plain union shares one memory region across its members with no record of which member
//   was last written; a "tagged union" pairs it with an enum field that tracks the active one.
// - sizeof a struct can exceed the sum of its members' sizes due to alignment padding.

#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
    Point origin;  // nested struct
    int width;
    int height;
} Rect;

typedef enum { RED, GREEN, BLUE } Color;

typedef enum { KIND_INT, KIND_FLOAT } ValueKind;

typedef struct {
    ValueKind kind;  // the "tag" that says which union member is currently valid
    union {
        int as_int;
        float as_float;
    } data;
} TaggedValue;

void move_by_pointer(Point *p, int dx, int dy);
void print_tagged(TaggedValue v);

int main(void) {
    // --- struct, nested struct ---
    Rect r = {.origin = {1, 2}, .width = 10, .height = 5};
    printf("nested struct: origin=(%d,%d) width=%d height=%d\n",
           r.origin.x, r.origin.y, r.width, r.height);

    // --- struct copy vs pointer ---
    Point a = {1, 1};
    Point copy = a;      // full value copy, independent of a
    copy.x = 99;
    printf("struct copy: a.x=%d unchanged, copy.x=%d changed\n", a.x, copy.x);

    Point b = {5, 5};
    move_by_pointer(&b, 3, 3);  // mutates the caller's b directly, no copy made
    printf("struct via pointer: b moved to (%d,%d)\n", b.x, b.y);

    // --- enum ---
    Color c = GREEN;
    printf("enum: GREEN has value %d (RED=%d, BLUE=%d)\n", c, RED, BLUE);

    // --- tagged union ---
    TaggedValue vi = {.kind = KIND_INT, .data.as_int = 42};
    TaggedValue vf = {.kind = KIND_FLOAT, .data.as_float = 3.5f};
    print_tagged(vi);
    print_tagged(vf);
    // TaggedValue bad = {.kind = KIND_INT, .data.as_int = 5};
    // printf("%f", bad.data.as_float);  // BUG: reading the wrong union member is UB garbage

    // --- sizeof / padding note ---
    printf("sizeof(Point)=%zu, sizeof(Rect)=%zu, sizeof(TaggedValue)=%zu "
           "(may exceed the sum of member sizes due to alignment padding)\n",
           sizeof(Point), sizeof(Rect), sizeof(TaggedValue));

    return 0;
}

void move_by_pointer(Point *p, int dx, int dy) {
    p->x += dx;  // -> is shorthand for (*p).x
    p->y += dy;
}

void print_tagged(TaggedValue v) {
    if (v.kind == KIND_INT) {
        printf("tagged union: int variant = %d\n", v.data.as_int);
    } else {
        printf("tagged union: float variant = %.1f\n", v.data.as_float);
    }
}

// Interview notes:
// - The tag field is what makes a union safe to use: the union itself has no idea which
//   member was last stored, so reading the "wrong" member reinterprets the raw bytes (UB).
// - Struct assignment/pass-by-value copies padding bytes too, which is why memcmp on structs
//   with padding is unreliable - compare fields individually instead.
// - Padding exists so members land on aligned addresses; reordering fields (largest first)
//   can shrink a struct's total size in practice.
