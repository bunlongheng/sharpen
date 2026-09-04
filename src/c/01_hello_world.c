// Step 1: Hello World - printf formats, variables, division, promotion, sizeof
// - printf format specifiers are not type-checked by the compiler by default; the wrong one
//   is undefined behavior, not a warning you can count on. Know %d %f %.2f %s %c %zu %x cold.
// - int/int division truncates toward zero; mixing an int with a float promotes to float first.
// - "integer promotion": operands smaller than int (char, short) are widened to int before
//   arithmetic, so char + char yields an int, not a char.
// - sizeof is evaluated at compile time for fixed types and returns a size_t (%zu to print it).

#include <stdio.h>

int main(void) {
    int a = 7;
    float f = 3.5f;
    char c = 'Q';
    unsigned int u = 255;

    printf("hello, world\n");

    // --- basic format specifiers ---
    printf("%%d int: %d\n", a);
    printf("%%f float (default 6 decimals): %f\n", f);
    printf("%%.2f float (2 decimals): %.2f\n", f);
    printf("%%s string: %s\n", "brushup");
    printf("%%c char: %c\n", c);
    printf("%%zu size_t: %zu\n", sizeof(int));
    printf("%%x hex: %x\n", u);

    // --- int vs float division ---
    int int_div = 7 / 2;          // truncates toward zero: 3, not 3.5
    float mixed_div = 7 / 2.0f;   // one operand is float, so this promotes to float math
    printf("int division 7/2 = %d\n", int_div);
    printf("mixed division 7/2.0f = %.1f\n", mixed_div);
    // printf("wrong: %d\n", mixed_div);  // BUG: %d on a float reads garbage bytes (UB)

    // --- integer promotion ---
    char c1 = 100, c2 = 100;
    int promoted = c1 + c2;  // both chars are promoted to int before the add
    printf("char+char promotes to int: %d (would overflow char range 127 max)\n", promoted);

    // --- sizeof of types ---
    printf("sizeof(char)=%zu sizeof(int)=%zu sizeof(long)=%zu sizeof(float)=%zu sizeof(double)=%zu\n",
           sizeof(char), sizeof(int), sizeof(long), sizeof(float), sizeof(double));

    return 0;
}

// Interview notes:
// - "Why does 7/2 give 3?" - both operands are int, so it's integer division; cast one side
//   to float (or use 7/2.0) to get 3.5.
// - printf/scanf format mismatches are a classic bug source: the compiler only catches them
//   with -Wformat (on by default under -Wall for printf-family calls with literal formats).
// - sizeof results are implementation-defined in absolute value but %zu is the portable way
//   to print them since size_t width varies by platform.
