// Step 2: Control Flow - if/else, switch, loops, break/continue, ternary
// - switch falls through on missing break; interviewers ask this to check you know it's a
//   feature (grouping cases), not just a footgun.
// - for/while/do-while differ in when the condition is checked: do-while always runs once.
// - goto exists in C (used for cleanup/error-exit patterns in real code) but is avoided here -
//   see the "goto cleanup;" pattern used later in 07_dynamic_memory.c style error handling.
// - ternary is an expression, not a statement, so it can be used inline in a printf call.

#include <stdio.h>

int main(void) {
    // --- if / else ---
    int score = 72;
    if (score >= 90) {
        printf("grade: A\n");
    } else if (score >= 70) {
        printf("grade: B\n");
    } else {
        printf("grade: C or below\n");
    }

    // --- switch with intentional fallthrough ---
    int day = 6;
    switch (day) {
        case 6:
        case 7:
            printf("switch: weekend (day %d falls through into this case)\n", day);
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            printf("switch: weekday\n");
            break;
        default:
            printf("switch: invalid day\n");
    }
    // switch (day) { case 6: printf("Sat"); case 7: printf("Sun"); }
    // BUG above: missing break after case 6 prints both "Sat" and "Sun" for day==6

    // --- for loop ---
    int for_sum = 0;
    for (int i = 1; i <= 5; i++) {
        for_sum += i;
    }
    printf("for loop sum 1..5 = %d\n", for_sum);

    // --- while loop ---
    int n = 5, factorial = 1;
    while (n > 0) {
        factorial *= n;
        n--;
    }
    printf("while loop 5! = %d\n", factorial);

    // --- do-while: body runs at least once even if condition starts false ---
    int count = 0;
    do {
        count++;
    } while (count < 0);  // condition is false immediately, but body already ran once
    printf("do-while ran once despite false condition: count = %d\n", count);

    // --- break / continue ---
    int first_even = -1, odd_count = 0;
    for (int i = 1; i <= 10; i++) {
        if (i % 2 != 0) {
            odd_count++;
            continue;  // skip the even check below for odd numbers
        }
        first_even = i;
        break;  // stop at the first even number found
    }
    printf("break/continue: first_even=%d, odds_seen_before_it=%d\n", first_even, odd_count);

    // --- ternary (an expression, usable inline) ---
    int x = 9;
    printf("ternary: x is %s\n", (x % 2 == 0) ? "even" : "odd");

    return 0;
}

// Interview notes:
// - Fallthrough is intentional grouping when cases share a body; forgetting break is the bug.
// - do-while's "runs at least once" guarantee is the key difference interviewers probe for.
// - goto is legal C and shows up for centralized cleanup in functions with multiple malloc
//   sites, but is avoided for ordinary control flow - structured loops read clearer.
