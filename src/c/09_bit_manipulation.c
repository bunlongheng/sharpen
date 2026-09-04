// Step 9: Bit Manipulation - &, |, ^, ~, <<, >>, set/clear/toggle/test, masks, popcount
// - & (AND) tests/clears bits, | (OR) sets bits, ^ (XOR) toggles bits, ~ (NOT) flips all bits.
// - << and >> shift bits left/right; left shift by n multiplies by 2^n (for non-negative
//   values that don't overflow); right shift on an unsigned value fills with zeros.
// - Bit i is set/cleared/toggled/tested using a mask (1u << i) combined with &, |, ^.
// - Counting set bits ("popcount") and checking power-of-2 (n & (n-1)) are classic interview
//   questions because they force you to reason about bits directly instead of arithmetic.

#include <stdio.h>

void print_binary(unsigned int n, int bits);
int count_set_bits(unsigned int n);
int is_power_of_two(unsigned int n);

int main(void) {
    unsigned int flags = 0;

    // --- set / clear / toggle / test a bit ---
    flags |= (1u << 1);   // set bit 1
    flags |= (1u << 3);   // set bit 3
    printf("after setting bits 1,3: ");
    print_binary(flags, 8);

    flags &= ~(1u << 1);  // clear bit 1
    printf("after clearing bit 1:  ");
    print_binary(flags, 8);

    flags ^= (1u << 3);   // toggle bit 3 (currently set -> becomes cleared)
    printf("after toggling bit 3:  ");
    print_binary(flags, 8);

    flags ^= (1u << 3);   // toggle again -> back to set
    printf("after toggling bit 3 again: ");
    print_binary(flags, 8);

    int bit3_set = (flags & (1u << 3)) != 0;  // test a bit
    printf("test bit 3: %s\n", bit3_set ? "set" : "clear");

    // --- basic bitwise operators ---
    unsigned int a = 0b1100, b = 0b1010;
    printf("a=");
    print_binary(a, 4);
    printf("b=");
    print_binary(b, 4);
    printf("a & b = "); print_binary(a & b, 4);
    printf("a | b = "); print_binary(a | b, 4);
    printf("a ^ b = "); print_binary(a ^ b, 4);
    printf("~a (as unsigned char) = "); print_binary((unsigned char)~a, 8);

    // --- shifts ---
    unsigned int x = 3;
    printf("3 << 2 = %u (multiply by 4)\n", x << 2);
    printf("16 >> 2 = %u (divide by 4)\n", 16u >> 2);

    // --- masks ---
    unsigned int value = 0xABCD;
    unsigned int low_byte = value & 0xFFu;  // mask off everything but the low 8 bits
    printf("value=0x%X, low byte via mask 0xFF = 0x%X\n", value, low_byte);

    // --- count set bits, power-of-2 check ---
    printf("count_set_bits(0b1011) = %d\n", count_set_bits(0xB));
    printf("is_power_of_two(16) = %d, is_power_of_two(18) = %d\n",
           is_power_of_two(16), is_power_of_two(18));

    return 0;
}

void print_binary(unsigned int n, int bits) {
    for (int i = bits - 1; i >= 0; i--) {
        printf("%d", (n >> i) & 1u);
    }
    printf("\n");
}

int count_set_bits(unsigned int n) {
    int count = 0;
    while (n) {
        count += (int)(n & 1u);
        n >>= 1;
    }
    return count;
}

int is_power_of_two(unsigned int n) {
    return n != 0 && (n & (n - 1)) == 0;  // a power of 2 has exactly one bit set
    // return (n & (n - 1)) == 0;  // BUG: forgetting n!=0 makes this wrongly true for n==0
}

// Interview notes:
// - n & (n-1) clears the lowest set bit; applying it repeatedly and counting iterations is
//   another way to compute popcount (Brian Kernighan's algorithm), faster when few bits are set.
// - Left-shifting a signed int into or past its sign bit is undefined behavior; prefer
//   unsigned types for bit-manipulation code.
// - Right shift on signed negative numbers is implementation-defined (arithmetic vs logical);
//   use unsigned types to get portable, predictable zero-fill behavior.
