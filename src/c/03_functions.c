// Step 3: Functions - prototypes, pass by value/pointer, recursion, static locals
// - Prototypes declare a function's signature before use so the compiler can check calls
//   against it even if the definition lives later in the file (or another translation unit).
// - C passes everything by value, including pointers themselves: to let a callee mutate the
//   caller's variable, you must pass the variable's address (a pointer to it).
// - static inside a function persists the variable's value across calls (initialized once).
// - "inline" is a hint to the compiler to avoid call overhead; it does not guarantee inlining
//   and the compiler is free to ignore it or inline non-inline functions on its own.

#include <stdio.h>

// prototypes
void try_increment_by_value(int n);
void increment_by_pointer(int *n);
long factorial(int n);
long fib(int n);
int next_ticket(void);

int main(void) {
    // --- pass by value: callee's copy changes, caller's variable does not ---
    int value = 5;
    try_increment_by_value(value);
    printf("pass by value: caller's variable unchanged: %d\n", value);

    // --- pass by pointer: callee mutates through the address ---
    int target = 5;
    increment_by_pointer(&target);
    printf("pass by pointer: caller's variable mutated: %d\n", target);

    // --- recursion ---
    printf("factorial(6) = %ld\n", factorial(6));
    printf("fib(10) = %ld\n", fib(10));

    // --- static local counter: persists between calls ---
    printf("next_ticket() calls: %d, %d, %d\n", next_ticket(), next_ticket(), next_ticket());

    return 0;
}

void try_increment_by_value(int n) {
    n++;  // only modifies the local copy; caller never sees this
    printf("inside try_increment_by_value: local copy n=%d\n", n);
}

void increment_by_pointer(int *n) {
    (*n)++;  // dereference to reach the caller's actual int
}

long factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}

long fib(int n) {
    if (n < 2) return n;                       // base case: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);             // exponential; fine for small n, not for large
}

int next_ticket(void) {
    static int counter = 0;  // initialized once, retains value across calls (not on the stack)
    return ++counter;
}

// Interview notes:
// - "Why didn't my function change the caller's int?" is almost always a pass-by-value
//   misunderstanding - the fix is to pass a pointer and dereference it to write through.
// - Naive recursive fib is O(2^n); a real interview follow-up is memoizing it or converting
//   to an iterative loop with two running values.
// - static locals are a common source of hidden global-like state; they also make a function
//   non-reentrant (unsafe to call concurrently from multiple threads without synchronization).
