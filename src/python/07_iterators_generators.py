# Step 7: Iterators and generators - the protocol, laziness, itertools
# - The iterator protocol: iter(obj) returns an iterator; next(it) advances it and raises
#   StopIteration when exhausted. `for` loops do this under the hood automatically.
# - A generator function (uses `yield`) is a shortcut for writing an iterator without a class -
#   each call resumes right after the last yield instead of starting over.
# - Generators are LAZY: values are produced one at a time, on demand, so an infinite generator
#   is fine as long as you only ever pull a finite number of values from it (e.g. via islice).
# - A generator expression `(x for x in ...)` is lazy like a generator function; a list
#   comprehension `[x for x in ...]` builds the whole list in memory immediately.

import itertools

# --- iter() / next() / StopIteration ---
it = iter([10, 20, 30])
print(f"next: {next(it)}")
print(f"next: {next(it)}")
print(f"next: {next(it)}")
try:
    next(it)
except StopIteration:
    print("StopIteration raised after exhausting the iterator")

# --- custom iterator class ---
class Countdown:
    def __init__(self, start):
        self.start = start
    def __iter__(self):
        return self  # the object is its own iterator
    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

print(f"custom iterator: {list(Countdown(3))}")

# --- generator function with yield ---
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1
print(f"generator function: {list(count_up_to(5))}")

# --- lazy evaluation: infinite generator + islice ---
def naturals():
    n = 1
    while True:
        yield n
        n += 1
first_five = list(itertools.islice(naturals(), 5))
print(f"infinite generator, first 5 via islice: {first_five}")

# --- generator expression vs list ---
gen_expr = (x * x for x in range(5))   # lazy - nothing computed yet
list_comp = [x * x for x in range(5)]  # eager - fully built now
print(f"generator expression consumed: {list(gen_expr)}")
print(f"list comprehension: {list_comp}")

# --- send() briefly ---
def echo_receiver():
    while True:
        received = yield
        print(f"  echo_receiver got: {received}")
receiver = echo_receiver()
next(receiver)  # prime the generator to the first yield
receiver.send("hello")
receiver.send("world")

# --- itertools: chain, islice, groupby ---
print(f"chain: {list(itertools.chain([1, 2], [3, 4]))}")
print(f"islice(range(10), 2, 6): {list(itertools.islice(range(10), 2, 6))}")
data = [("a", 1), ("a", 2), ("b", 3)]  # groupby needs consecutive-equal keys, so data is sorted
grouped = {key: [v for _, v in group] for key, group in itertools.groupby(data, key=lambda pair: pair[0])}
print(f"groupby: {grouped}")
