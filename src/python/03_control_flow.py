# Step 3: Control flow - if/else, truthiness, loops, comprehensions, match/case, walrus
# - Python has no switch statement pre-3.10; match/case (3.10+) does structural pattern matching,
#   not just value equality.
# - Truthiness: 0, 0.0, "", [], {}, set(), None are all falsy; everything else is truthy.
# - for/else and while/else: the else runs only if the loop finished WITHOUT hitting break.
# - The walrus operator (:=) assigns and returns a value in one expression - handy in a while
#   condition or a comprehension to avoid computing something twice.

# --- if/elif/else + truthiness ---
for candidate in [0, "", [], "hi", 5]:
    if candidate:
        print(f"{candidate!r} is truthy")
    else:
        print(f"{candidate!r} is falsy")

# --- for with enumerate/zip/range ---
letters = ["a", "b", "c"]
for i, letter in enumerate(letters):
    print(f"enumerate: {i} -> {letter}")

names = ["alice", "bob"]
scores = [90, 85]
for name, score in zip(names, scores):
    print(f"zip: {name} scored {score}")

for n in range(0, 6, 2):  # start, stop (exclusive), step
    print(f"range step: {n}")

# --- while + break/else ---
n = 0
while n < 10:
    if n == 3:
        break
    n += 1
else:
    # skipped because we broke out - else only runs if the loop condition became False naturally
    print("while completed without break (not printed)")
print(f"while loop stopped at n={n}")

# --- comprehensions with condition ---
evens = [x for x in range(10) if x % 2 == 0]
print(f"list comprehension (evens): {evens}")
squares_over_10 = {x: x * x for x in range(6) if x * x > 10}
print(f"dict comprehension (filtered): {squares_over_10}")
unique_lengths = {len(w) for w in ["a", "bb", "cc", "ddd"]}
print(f"set comprehension: {sorted(unique_lengths)}")

# --- match/case (3.10+) with structured patterns ---
def describe(point):
    match point:
        case (0, 0):
            return "origin"
        case (x, 0):
            return f"on x-axis at {x}"
        case (0, y):
            return f"on y-axis at {y}"
        case (x, y) if x == y:
            return f"on the diagonal at {x}"
        case (x, y):
            return f"point at ({x}, {y})"
        case _:
            return "not a point"

for pt in [(0, 0), (5, 0), (0, 5), (2, 2), (1, 2)]:
    print(f"match: {pt} -> {describe(pt)}")

# --- walrus operator ---
data = [1, 2, 3, 4, 5]
# Without walrus you'd call len(data) twice; with it, the assignment happens inline.
if (n := len(data)) > 3:
    print(f"walrus: data has {n} items, which is > 3")
