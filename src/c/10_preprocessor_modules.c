// Step 10: Preprocessor and Modules - macros, conditional compilation, file-scope, assert
// - #define creates constants and function-like macros via textual substitution before
//   compilation even begins; macros have no type checking and no scope.
// - Function-like macros need parentheses around every parameter use, or the substituted
//   expression can be silently reparsed in a way the caller never intended.
// - #ifdef/#ifndef gate code on whether a macro is defined; header guards use #ifndef/#define
//   at the top of a header to prevent it from being included (and its contents redefined)
//   twice in one translation unit.
// - static at file scope limits a function/variable's linkage to this .c file only; extern
//   declares that a symbol is defined in another translation unit and linked at build time.
// - assert aborts the program if its condition is false; it's a debugging aid and is compiled
//   out entirely when NDEBUG is defined (so never rely on it for real error handling).

#include <stdio.h>
#include <assert.h>

// --- object-like macro: constant ---
#define MAX_USERS 100

// --- function-like macro, correctly parenthesized ---
#define SQUARE(x) ((x) * (x))

// --- function-like macro WITH the missing-parentheses bug, shown for comparison ---
#define SQUARE_BUGGY(x) (x * x)

// --- header guard pattern (shown here in a comment; this .c file has no header of its own):
// #ifndef BRUSH UP_MYHEADER_H
// #define BRUSH UP_MYHEADER_H
// ... declarations ...
// #endif

// --- conditional compilation ---
#define FEATURE_LOGGING

#ifdef FEATURE_LOGGING
static void log_line(const char *msg) {  // static: only visible/linkable within this file
    printf("[log] %s\n", msg);
}
#endif

#ifndef FEATURE_METRICS
// FEATURE_METRICS was never defined, so this branch compiles instead
static void note_no_metrics(void) {
    printf("metrics feature not compiled in\n");
}
#endif

// extern note: a symbol like "extern int global_counter;" in a header tells other .c files
// that global_counter is defined once elsewhere (e.g. "int global_counter = 0;" in one .c
// file) and should be linked to that single definition rather than each file having its own.

int main(void) {
    printf("MAX_USERS constant = %d\n", MAX_USERS);

    printf("SQUARE(5) = %d\n", SQUARE(5));
    int a = 2, b = 3;
    printf("SQUARE(a + b) with correct macro = %d (expected 25)\n", SQUARE(a + b));

    // The buggy macro expands "SQUARE_BUGGY(a + b)" to "(a + b * b)" via pure text substitution,
    // NOT "((a+b) * (a+b))", because the parameter itself isn't wrapped in parentheses.
    printf("SQUARE_BUGGY(a + b) with missing parens = %d (wrong: expands to a + b*b)\n",
           SQUARE_BUGGY(a + b));

#ifdef FEATURE_LOGGING
    log_line("logging feature is compiled in");
#endif

#ifndef FEATURE_METRICS
    note_no_metrics();
#endif

    // --- assert: aborts if the condition is false (debugging aid, stripped when NDEBUG set) ---
    int result = SQUARE(4);
    assert(result == 16);
    printf("assert(result == 16) passed, result = %d\n", result);

    return 0;
}

// Interview notes:
// - "Why did SQUARE_BUGGY(a+b) give the wrong number?" is the classic macro-hygiene question:
//   macros substitute text, not evaluated expressions, so every parameter use needs its own
//   parentheses, and the whole macro body usually needs to be wrapped in parentheses too.
// - Header guards prevent duplicate-definition compile errors when a header is transitively
//   included more than once; the alternative is "#pragma once" (widely supported, not
//   technically standard C).
// - static file-scope functions/variables avoid polluting the global symbol namespace and
//   let the linker/compiler optimize more aggressively knowing nothing external can call them.
