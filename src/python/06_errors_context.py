# Step 6: Errors and context managers - exceptions, EAFP vs LBYL, with-blocks
# - try/except/else/finally: else only runs if no exception was raised; finally always runs.
# - Custom exceptions subclass Exception and can carry extra data (a message plus a field).
# - `raise ... from ...` chains exceptions, preserving the original cause in the traceback.
# - EAFP ("ask forgiveness") tries the operation and handles failure; it beats LBYL ("look
#   before you leap") pre-checks, which can race between the check and the use.
# - A context manager (@contextmanager or __enter__/__exit__) guarantees cleanup even under an
#   exception - the same guarantee `finally` gives, but scoped and reusable.
import contextlib
# --- try/except/else/finally ---
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("  caught ZeroDivisionError")
        return None
    else:  # only runs if the try block did NOT raise
        print(f"  no error, result={result}")
        return result
    finally:  # always runs, error or not
        print("  divide() cleanup ran")
divide(10, 2)
divide(10, 0)
# --- exception hierarchy ---
print(f"ZeroDivisionError<-ArithmeticError: {issubclass(ZeroDivisionError, ArithmeticError)}, "
      f"ArithmeticError<-Exception: {issubclass(ArithmeticError, Exception)}")
# --- custom exception with a message and a field ---
class InsufficientFundsError(Exception):
    def __init__(self, message, shortfall):
        super().__init__(message)
        self.shortfall = shortfall
def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError("not enough funds", shortfall=amount - balance)
    return balance - amount
try: withdraw(50, 80)
except InsufficientFundsError as e: print(f"custom exception: {e}, shortfall={e.shortfall}")
# --- raise ... from ... ---
def parse_config(raw):
    try:
        return int(raw)
    except ValueError as e:
        raise RuntimeError(f"invalid config value: {raw!r}") from e
try: parse_config("not-a-number")
except RuntimeError as e: print(f"chained exception: {e}, cause={e.__cause__!r}")
# --- EAFP vs LBYL ---
d = {"a": 1}
if "a" in d:  # LBYL: check first, then act - can race if `d` changes before the access
    print(f"LBYL: {d['a']}")
try: print(f"EAFP: {d['b']}")  # EAFP: just try it, handle failure - the Pythonic default
except KeyError: print("EAFP: 'b' missing, handled")
# --- context managers: @contextmanager function ---
@contextlib.contextmanager
def timer_label(label):
    print(f"  enter: {label}")
    yield label
    print(f"  exit: {label}")
with timer_label("task-1") as label:
    print(f"  inside with-block: {label}")
# --- context managers: class with __enter__/__exit__ ---
class Resource:
    def __enter__(self):
        print("  Resource acquired")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"  Resource released (exception raised: {exc_type is not None})")
        return False  # False means: don't suppress the exception
with Resource():
    print("  using resource")
# --- contextlib.suppress ---
with contextlib.suppress(KeyError):
    _ = {}["missing"]  # would raise KeyError, but suppress() swallows it
print("suppress: continued past the missing-key error")
