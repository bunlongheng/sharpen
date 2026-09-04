# Step 1: Hello World - print, variables, f-strings, basic types
# - Python is dynamically typed: a name can be rebound to any type at runtime, unlike TS where
#   a variable's type is fixed by its declaration/annotation.
# - f-strings (f"...") are the idiomatic way to build strings; they inline expressions directly.
# - type() gives the exact runtime class; isinstance() also matches subclasses, so prefer it
#   for checks (interviewers ask this: isinstance(True, int) is True since bool subclasses int).
# - None is Python's null; comparing to it should use `is None`, not `== None`.

print("Hello, Python")

# Dynamic typing: same name, different types over time (legal, but usually bad style).
value = 30
print(f"value is {value} ({type(value).__name__})")
value = "now a string"
print(f"value is {value!r} ({type(value).__name__})")

# f-strings with format specs: :.2f rounds to 2 decimals, :>8 right-aligns in an 8-char field.
pi = 3.14159265
print(f"pi rounded: {pi:.2f}")
print(f"right-aligned: {'hi':>8}|")

# Multiple assignment - unpacks the right side positionally, one statement, no temp variable.
a, b, c = 1, 2, 3
print(f"a={a} b={b} c={c}")

# Swap without a temp variable - idiomatic Python, uses tuple packing/unpacking under the hood.
a, b = b, a
print(f"swapped: a={a} b={b}")

# The core scalar types.
an_int = 7
a_float = 7.0
a_str = "seven"
a_bool = True
a_none = None
print(f"int={an_int} float={a_float} str={a_str} bool={a_bool} none={a_none}")

# type() gives the exact class; isinstance() also matches subclasses - prefer isinstance for
# checks in real code.
print(f"type(an_int) is {type(an_int)}")
print(f"isinstance(an_int, int) -> {isinstance(an_int, int)}")
# Common gotcha: bool is a subclass of int, so isinstance(True, int) is True.
print(f"isinstance(True, int) -> {isinstance(True, int)}")
# Mistake to name: `type(x) == int` fails for subclasses (e.g. bool); isinstance() is the
# idiomatic, subclass-aware check.
print(f"type(True) == int -> {type(True) == int}")
