// Step 5: Arrays and Strings - decay, 2D arrays, NUL terminator, strlen vs sizeof, snprintf
// - An array decays to a pointer to its first element when passed to a function, so sizeof
//   inside the callee gives the pointer's size, not the array's - only the caller's sizeof
//   sees the true array size.
// - A C string is just a char array that ends with a '\0' (NUL) byte; strlen scans for it.
// - strlen(s) counts characters up to (not including) '\0'; sizeof(s) on an array literal
//   counts total bytes including the '\0' and any unused capacity.
// - snprintf bounds the write and always NUL-terminates (when size > 0), unlike strcpy.

#include <stdio.h>
#include <string.h>

void show_sizeof_in_callee(int *arr);

int main(void) {
    // --- array decay ---
    int nums[6] = {1, 2, 3, 4, 5, 6};
    printf("sizeof(nums) in caller (true array size): %zu bytes\n", sizeof(nums));
    show_sizeof_in_callee(nums);

    // --- 2D arrays ---
    int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int row_sum = 0;
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            row_sum += grid[r][c];
        }
    }
    printf("2D array grid[1][2]=%d, sum of all elements=%d\n", grid[1][2], row_sum);

    // --- C strings and the NUL terminator ---
    char greeting[] = "hi";  // {'h', 'i', '\0'} - 3 bytes total
    printf("string \"%s\" occupies %zu bytes (2 chars + 1 NUL terminator)\n",
           greeting, sizeof(greeting));

    // --- strlen vs sizeof ---
    char buf[20] = "brushup";
    printf("strlen(buf)=%zu (chars before NUL), sizeof(buf)=%zu (full buffer capacity)\n",
           strlen(buf), sizeof(buf));

    // --- safe copy with snprintf (bounds-checked, always NUL-terminates) ---
    char dest[6];
    int written = snprintf(dest, sizeof(dest), "%s", "truncateme");
    printf("snprintf into 6-byte buf: dest=\"%s\", would_have_written=%d bytes (truncated)\n",
           dest, written);
    // strcpy(dest, "truncateme");  // BUG: no bounds check, overflows dest and corrupts memory

    // --- strcmp ---
    const char *a = "apple";
    const char *b = "banana";
    printf("strcmp(\"apple\",\"banana\")=%d (negative means a < b lexically)\n", strcmp(a, b));
    printf("strcmp(\"apple\",\"apple\")=%d (0 means equal)\n", strcmp(a, "apple"));

    return 0;
}

void show_sizeof_in_callee(int *arr) {
    // arr arrived here as a decayed pointer (the "int arr[]" parameter spelling means the
    // same thing), so this is sizeof(int*), NOT the original array's byte size
    printf("sizeof(arr) in callee (decayed to pointer): %zu bytes\n", sizeof(arr));
}

// Interview notes:
// - "Why does sizeof give me 8 inside the function?" is the array-decay trap: pass the
//   length explicitly as a second parameter since the callee can't recover it from the array.
// - strcmp returns <0, 0, or >0, never a boolean - comparing "if (strcmp(a,b))" is true when
//   they DIFFER, which trips people up when they expect true-means-equal.
// - Prefer snprintf over strcpy/strcat/sprintf whenever the input length isn't guaranteed safe.
