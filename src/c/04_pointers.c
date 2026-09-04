// Step 4: Pointers - address-of/deref, arithmetic, NULL checks, pointer-to-pointer, const
// - &x gets an address, *p dereferences a pointer to reach the pointee's value.
// - Pointer arithmetic is scaled by the pointee's type size: p+1 moves sizeof(*p) bytes, not 1.
// - Always check a pointer against NULL before dereferencing it if it might not have been set.
// - const placement matters: "const int *p" is a pointer to a const int (can't modify *p,
//   can reassign p); "int *const p" is a const pointer to int (opposite: can modify *p,
//   cannot reassign p).
// - Raw addresses are never deterministic across runs, so we print offsets/differences instead.

#include <stdio.h>

void swap(int *a, int *b);

int main(void) {
    // --- address-of and dereference ---
    int x = 42;
    int *p = &x;
    printf("address-of/deref: x=%d, *p=%d, *p == x -> %d\n", x, *p, *p == x);
    *p = 100;  // writing through the pointer changes x itself
    printf("after *p = 100: x=%d\n", x);

    // --- pointer arithmetic on an array (print offsets, never raw addresses) ---
    int arr[5] = {10, 20, 30, 40, 50};
    int *arr_p = arr;  // array decays to a pointer to its first element
    for (int i = 0; i < 5; i++) {
        printf("arr[%d]=%d, byte offset from base=%td\n",
               i, *(arr_p + i), (char *)(arr_p + i) - (char *)arr_p);
    }

    // --- NULL checks ---
    int *maybe_null = NULL;
    if (maybe_null == NULL) {
        printf("NULL check: maybe_null is NULL, skipping dereference\n");
    }
    maybe_null = &x;
    if (maybe_null != NULL) {
        printf("NULL check: maybe_null now points to a valid int: %d\n", *maybe_null);
    }
    // int crash = *((int *)NULL);  // BUG: dereferencing NULL is undefined behavior (crash)

    // --- pointer to pointer ---
    int **pp = &p;
    printf("pointer to pointer: **pp=%d (p points to x, pp points to p)\n", **pp);

    // --- const pointer vs pointer to const ---
    int a = 1, b = 2;
    const int *ptr_to_const = &a;  // cannot do *ptr_to_const = 99, but can repoint it
    ptr_to_const = &b;             // legal: repointing is fine
    printf("pointer to const: now reading b through it = %d\n", *ptr_to_const);
    // *ptr_to_const = 99;  // BUG: would fail to compile, *ptr_to_const is read-only

    int c = 3;
    int *const const_ptr = &c;  // can modify *const_ptr, cannot repoint const_ptr
    *const_ptr = 30;
    printf("const pointer: value changed through it = %d\n", c);
    // const_ptr = &a;  // BUG: would fail to compile, const_ptr cannot be reassigned

    // --- swap via pointers ---
    int m = 1, n = 2;
    printf("before swap: m=%d n=%d\n", m, n);
    swap(&m, &n);
    printf("after swap: m=%d n=%d\n", m, n);

    return 0;
}

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

// Interview notes:
// - "const int *p" reads right-to-left from p: p is a pointer to (a const int).
// - Pointer arithmetic bugs usually come from mixing up element count and byte count; always
//   let the type's size do the scaling instead of hand-computing byte offsets.
// - A double pointer is common for functions that need to reseat the caller's pointer itself
//   (e.g. a function that allocates and hands back a new buffer via int **out).
