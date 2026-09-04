// Step 7: Dynamic Memory - malloc/calloc/realloc/free, growing an array, ownership
// - malloc allocates uninitialized memory; calloc allocates AND zero-initializes it.
// - realloc may move the block to a new address, so always reassign its return value; never
//   trust the old pointer afterward, and never assign the result directly over the only
//   pointer to the block (if realloc fails and returns NULL, you'd leak the original block).
// - Ownership convention: whoever mallocs a block is responsible for freeing it exactly once,
//   or documenting a transfer of ownership (e.g. "caller must free the returned pointer").
// - free(p) does not set p to NULL automatically; do it yourself to make a stale pointer
//   safely detectable (dereferencing/freeing NULL again is a no-op / defined behavior).

#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // --- malloc: uninitialized memory ---
    int *single = malloc(sizeof(int));
    if (single == NULL) {
        fprintf(stderr, "malloc failed\n");
        return 1;
    }
    *single = 7;  // must initialize before reading; malloc does not zero it
    printf("malloc: single=%d\n", *single);
    free(single);
    single = NULL;  // avoid a dangling pointer after free

    // --- calloc: zero-initialized memory ---
    int count = 5;
    int *zeroed = calloc((size_t)count, sizeof(int));
    if (zeroed == NULL) {
        fprintf(stderr, "calloc failed\n");
        return 1;
    }
    printf("calloc: zero-initialized values = %d %d %d %d %d\n",
           zeroed[0], zeroed[1], zeroed[2], zeroed[3], zeroed[4]);

    // --- growing a dynamic array with realloc ---
    int capacity = count;
    int size = 0;
    int *dynamic = zeroed;  // ownership of this block now tracked via `dynamic`
    for (int i = 0; i < 8; i++) {
        if (size == capacity) {
            capacity *= 2;
            int *grown = realloc(dynamic, (size_t)capacity * sizeof(int));
            if (grown == NULL) {
                fprintf(stderr, "realloc failed\n");
                free(dynamic);  // original block still valid and must be freed on failure
                return 1;
            }
            dynamic = grown;  // reassign only after confirming success
        }
        dynamic[size++] = (i + 1) * 10;
    }
    printf("realloc grew array to capacity=%d, size=%d, values:", capacity, size);
    for (int i = 0; i < size; i++) {
        printf(" %d", dynamic[i]);
    }
    printf("\n");

    free(dynamic);
    dynamic = NULL;

    // --- common mistakes (commented out on purpose) ---
    // free(dynamic); free(dynamic);      // BUG: double-free, corrupts the heap allocator
    // int leftover = dynamic[0];         // BUG: use-after-free, reads freed/reused memory
    // dynamic = realloc(dynamic, 100);   // BUG: if this realloc fails and returns NULL, the
    //                                    //      original block address is lost -> memory leak

    printf("done: all blocks freed, pointers set to NULL\n");
    return 0;
}

// Interview notes:
// - "Why did my program crash later, not at the bad line?" - heap corruption from a
//   double-free or use-after-free often surfaces far from the actual bug; tools like
//   AddressSanitizer (-fsanitize=address) catch these at the point of misuse.
// - Always check malloc/calloc/realloc for NULL before using the result; treat allocation
//   failure as a real code path, not something that "won't happen."
// - Setting a pointer to NULL right after free is cheap insurance: a NULL deref crashes
//   loudly and immediately instead of silently corrupting memory.
