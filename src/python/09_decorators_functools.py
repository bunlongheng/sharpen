# Step 9: Decorators and functools - wrapping functions, caching, composition
# - A decorator is a function that takes a function and returns a (usually wrapped) function;
#   `@deco` above `def f` is sugar for `f = deco(f)`.
# - functools.wraps copies over __name__/__doc__ from the original function onto the wrapper -
#   skip it and debugging tools/introspection see the wrapper's identity instead of the real one.
# - A decorator that takes arguments needs an extra outer layer: decorator_factory(args) ->
#   decorator(fn) -> wrapper(*a, **kw).
# - lru_cache memoizes automatically based on arguments - proven here via call count, not
#   timing (wall-clock timing would be nondeterministic across runs).
import functools
# --- hand-written decorator with functools.wraps ---
def logged(fn):
    @functools.wraps(fn)  # without this, wrapper.__name__ would be "wrapper", not "add"
    def wrapper(*args, **kwargs):
        result = fn(*args, **kwargs)
        print(f"  logged: {fn.__name__}({args}) -> {result}")
        return result
    return wrapper

@logged
def add(a, b):
    return a + b
add(2, 3)
print(f"functools.wraps preserved name: {add.__name__}")
# --- decorator with arguments ---
def repeat(times):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            results = [fn(*args, **kwargs) for _ in range(times)]
            return results
        return wrapper
    return decorator
@repeat(times=3)
def shout(word):
    return word.upper()
print(f"repeat(times=3): {shout('hi')}")
# --- stacking decorators ---
@logged
@repeat(times=2)
def double(n):
    return n * 2
double(5)  # logged wraps repeat wraps double - applied bottom-up, so repeat runs first
# --- functools.lru_cache: prove caching via call count, not timing ---
call_count = 0
@functools.lru_cache(maxsize=None)
def fib(n):
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
fib(15)
print(f"lru_cache: fib(15) computed with only {call_count} calls (no cache would be ~1973)")
print(f"cache_info: {fib.cache_info()}")
# --- functools.partial ---
def power(base, exponent):
    return base ** exponent
square = functools.partial(power, exponent=2)
print(f"partial (square via power): {square(5)}")
# --- functools.reduce ---
product = functools.reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)
print(f"reduce (product): {product}")
# --- functools.singledispatch ---
@functools.singledispatch
def describe(value):
    return f"generic: {value!r}"
@describe.register
def _(value: int):
    return f"int: {value}"
@describe.register
def _(value: str):
    return f"str: {value!r}"
for v in [42, "hi", 3.14]:
    print(f"singledispatch: {describe(v)}")
