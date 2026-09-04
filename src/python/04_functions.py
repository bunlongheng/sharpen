# Step 4: Functions - args, closures, recursion, first-class functions
# - *args collects extra positional args into a tuple; **kwargs collects extra keyword args
#   into a dict.
# - `*` in a signature marks everything after it keyword-only; `/` marks everything before it
#   positional-only (3.8+).
# - Functions are first-class objects: assign them to names, pass them as arguments, return them.
# - A closure captures variables from its enclosing scope; `nonlocal` lets an inner function
#   REASSIGN (not just read) an outer variable.
# - Recursion + a dict-based memo cache avoids exponential recomputation (classic fib example).

# --- default args, *args, **kwargs ---
def greet(name, greeting="Hello", *extra_names, **details):
    all_names = ", ".join((name, *extra_names))
    detail_str = ", ".join(f"{k}={v}" for k, v in sorted(details.items()))
    return f"{greeting}, {all_names}! ({detail_str})" if detail_str else f"{greeting}, {all_names}!"

print(greet("Alice"))
print(greet("Alice", "Hi", "Bob", "Carol", role="admin", active=True))

# --- keyword-only and positional-only params ---
def power(base, exponent, /, *, rounded=False):
    # base, exponent: positional-only (before /). rounded: keyword-only (after *).
    result = base ** exponent
    return round(result) if rounded else result

print(f"power(2, 10)={power(2, 10)}")
print(f"power(2, 0.5, rounded=True)={power(2, 0.5, rounded=True)}")
# power(base=2, exponent=10)  # <- would fail: base/exponent are positional-only

# --- first-class functions and lambda ---
def apply_twice(fn, value):
    return fn(fn(value))

square = lambda x: x * x
print(f"apply_twice(square, 3)={apply_twice(square, 3)}")
print(f"apply_twice with named fn={apply_twice(lambda x: x + 1, 10)}")

# --- closures + nonlocal ---
def make_counter():
    count = 0
    def increment():
        nonlocal count  # without this, `count += 1` would raise UnboundLocalError
        count += 1
        return count
    return increment

counter = make_counter()
print(f"closure counter calls: {counter()}, {counter()}, {counter()}")

# --- recursion with memo via dict ---
def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

print(f"fib(20)={fib(20)}")

# --- docstrings and __doc__ ---
def add(a, b):
    """Return the sum of a and b."""
    return a + b

print(f"add.__doc__ -> {add.__doc__}")
