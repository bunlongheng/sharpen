// Step 8: Function Pointers - syntax, typedef, qsort comparators, dispatch tables
// - A function pointer's declaration syntax mirrors the function it points to:
//   "int (*fp)(int, int)" is a pointer to a function taking two ints and returning int.
// - typedef-ing that syntax makes it readable and reusable as a normal-looking type name.
// - qsort takes a generic comparator: negative means a<b, zero means equal, positive means a>b.
// - A dispatch table (array of function pointers, often indexed by an enum) replaces long
//   if/else or switch chains for selecting behavior at runtime.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef int (*BinaryOp)(int, int);  // typedef for a function pointer type

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int cmp_ints_ascending(const void *a, const void *b) {
    int ia = *(const int *)a;
    int ib = *(const int *)b;
    return ia - ib;  // negative if ia<ib, 0 if equal, positive if ia>ib
    // return *(const int*)a > *(const int*)b;  // BUG: loses "equal"/ordering info as a bool
}

int cmp_strings(const void *a, const void *b) {
    const char *sa = *(const char **)a;
    const char *sb = *(const char **)b;
    return strcmp(sa, sb);
}

int main(void) {
    // --- basic function pointer syntax ---
    int (*fp)(int, int) = add;
    printf("raw function pointer syntax: fp(2,3) = %d\n", fp(2, 3));

    // --- typedef'd function pointer ---
    BinaryOp op = mul;
    printf("typedef'd function pointer: op(4,5) = %d\n", op(4, 5));

    // --- qsort with an int comparator ---
    int nums[] = {5, 2, 8, 1, 9, 3};
    size_t n = sizeof(nums) / sizeof(nums[0]);
    qsort(nums, n, sizeof(int), cmp_ints_ascending);
    printf("qsort ints ascending:");
    for (size_t i = 0; i < n; i++) printf(" %d", nums[i]);
    printf("\n");

    // --- qsort with a string comparator ---
    const char *words[] = {"banana", "apple", "cherry"};
    size_t wn = sizeof(words) / sizeof(words[0]);
    qsort(words, wn, sizeof(char *), cmp_strings);
    printf("qsort strings ascending:");
    for (size_t i = 0; i < wn; i++) printf(" %s", words[i]);
    printf("\n");

    // --- dispatch table of operations ---
    BinaryOp table[] = {add, sub, mul};
    const char *names[] = {"add", "sub", "mul"};
    for (size_t i = 0; i < 3; i++) {
        printf("dispatch table: %s(10, 4) = %d\n", names[i], table[i](10, 4));
    }

    return 0;
}

// Interview notes:
// - qsort's comparator must define a consistent total order; using bool-like 0/1 results
//   (like "a > b") breaks equal-element handling and can produce an invalid sort.
// - A dispatch table trades a switch statement's readability for O(1) lookup and easy runtime
//   extension (e.g. plugin-style handlers keyed by an enum or string).
// - Function pointer syntax is famously hard to read; a typedef is almost always worth it
//   the moment the type appears more than once.
