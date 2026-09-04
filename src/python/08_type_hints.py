# Step 8: Type hints - annotations, generics, structural typing
# - Type hints are documentation + tooling input ONLY: Python does not enforce them at runtime
#   (unlike TS). Tools like mypy/pyright do the checking, separately, before you run the code.
# - list[int], dict[str, int] are built-in generic syntax (3.9+) - no need to import List/Dict.
# - Optional[X] means X | None; the `|` union syntax (3.10+) is the modern way to write unions.
# - TypedDict describes the shape of a plain dict; Protocol is structural typing (duck typing a
#   type checker can verify, no inheritance required).
from typing import TypedDict, Protocol, TypeVar, Generic, Literal, Final, Optional

# --- annotations for params/returns ---
def add(a: int, b: int) -> int:
    return a + b
print(f"add(2, 3) -> {add(2, 3)}")

# --- Optional and union with | ---
def find_user(user_id: int) -> Optional[str]:
    users = {1: "Nova"}
    return users.get(user_id)
def to_label(value: int | str) -> str:  # modern union syntax, 3.10+
    return f"label:{value}"
print(f"find_user(1) -> {find_user(1)}, find_user(2) -> {find_user(2)}")
print(f"to_label -> {to_label(5)}, {to_label('x')}")

# --- list[int] / dict[str, int] ---
def total(nums: list[int]) -> int:
    return sum(nums)
def word_lengths(words: list[str]) -> dict[str, int]:
    return {w: len(w) for w in words}
print(f"total -> {total([1, 2, 3])}")
print(f"word_lengths -> {word_lengths(['a', 'bb'])}")

# --- TypedDict ---
class Movie(TypedDict):
    title: str
    year: int
m: Movie = {"title": "Arrival", "year": 2016}  # a dict shape-checked by tools, still a plain dict
print(f"TypedDict instance -> {m}")

# --- Protocol: structural typing ---
class SupportsArea(Protocol):
    def area(self) -> float: ...
class Square:
    def __init__(self, side: float):
        self.side = side
    def area(self) -> float:
        return self.side ** 2
def print_area(shape: SupportsArea) -> None:
    # Square never mentions SupportsArea - it matches because it HAS the right method shape.
    print(f"  area -> {shape.area()}")
print_area(Square(4))

# --- Generic TypeVar ---
T = TypeVar("T")  # a type variable: Stack[int] and Stack[str] are both valid, type-checked uses
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
print(f"generic Stack[int] pop -> {int_stack.pop()}")

# --- Literal and Final ---
Mode = Literal["read", "write"]
def open_mode(mode: Mode) -> str:
    return f"opening in {mode} mode"
print(open_mode("read"))
MAX_RETRIES: Final = 3  # Final signals "don't reassign" to the type checker only
print(f"MAX_RETRIES -> {MAX_RETRIES}")
# add() is typed (int, int) -> int, but Python runs it fine with strings anyway - a type
# checker (mypy/pyright) would flag this line as an error WITHOUT ever running the code.
print(f"hints not enforced at runtime: add('2', '3') -> {add('2', '3')}")
