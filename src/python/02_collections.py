# Step 2: Collections - list, tuple, dict, set, copying
# - list: ordered, mutable, resizable. tuple: ordered, immutable - use it for fixed records.
# - dict: hash map; .get() avoids KeyError, .setdefault() inserts-if-missing in one call.
# - set: unordered, deduped; supports union/intersection like real set algebra.
# - Mutable default arguments are evaluated ONCE at def time and shared across calls - a classic
#   interview trap. Use None and create the mutable value inside the function instead.
# - Shallow copy duplicates the outer container only; deep copy duplicates everything recursively.

import copy

# --- list ---
nums = [3, 1, 2]
nums.append(4)
print(f"list after append: {nums}")
print(f"slice [1:3]: {nums[1:3]}")
print(f"negative index [-1]: {nums[-1]}")
# sort() mutates in place and returns None; sorted() returns a new list, leaves original alone.
nums.sort()
print(f"nums.sort() mutated in place: {nums}")
unsorted = [5, 4, 6]
result = sorted(unsorted)
print(f"sorted() returns new list: {result}, original untouched: {unsorted}")

# --- tuple ---
point = (3, 4)
# point[0] = 9  # <- would fail: 'tuple' object does not support item assignment
x, y = point  # unpacking
print(f"tuple point={point}, unpacked x={x} y={y}")

# --- dict ---
ages = {"alice": 30, "bob": 25}
print(f"get existing: {ages.get('alice')}, get missing with default: {ages.get('carol', 0)}")
for name, age in sorted(ages.items()):
    print(f"  {name}: {age}")
ages.setdefault("carol", 22)  # inserts only if key is absent
ages.setdefault("alice", 99)  # alice already exists, so this is a no-op
print(f"after setdefault: {sorted(ages.items())}")
squares = {n: n * n for n in range(4)}  # dict comprehension
print(f"dict comprehension: {squares}")

# --- set ---
dupes = [1, 2, 2, 3, 3, 3]
deduped = set(dupes)
print(f"deduped: {sorted(deduped)}")
a_set = {1, 2, 3}
b_set = {2, 3, 4}
print(f"union: {sorted(a_set | b_set)}")
print(f"intersection: {sorted(a_set & b_set)}")

# --- mutable-default-argument trap ---
def bad_append(item, bucket=[]):  # noqa: the default list is created ONCE, at def time
    bucket.append(item)
    return bucket

def good_append(item, bucket=None):
    if bucket is None:
        bucket = []  # fresh list every call
    bucket.append(item)
    return bucket

print(f"bad_append call 1: {bad_append('x')}")
print(f"bad_append call 2 (leaked state!): {bad_append('y')}")
print(f"good_append call 1: {good_append('x')}")
print(f"good_append call 2 (clean): {good_append('y')}")

# --- shallow vs deep copy ---
original = {"nested": [1, 2, 3]}
shallow = copy.copy(original)
deep = copy.deepcopy(original)
original["nested"].append(4)
print(f"shallow shares inner list: {shallow}")
print(f"deep copy is fully independent: {deep}")
