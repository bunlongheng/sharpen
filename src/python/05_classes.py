# Step 5: Classes - attributes, properties, inheritance, dataclasses, duck typing
# - Instance attributes live per-object (__init__); class attributes are shared by every
#   instance unless one shadows them - a common source of surprising shared state.
# - @property exposes a method as an attribute, adding validation without changing the API.
# - __repr__ is for developers (unambiguous); __str__ is for end users (readable); print() uses
#   __str__, falling back to __repr__ if __str__ is absent.
# - @dataclass auto-generates __init__, __repr__, and __eq__ from field annotations.
# - Duck typing: Python cares about an object's behavior (methods it has), not its declared type.

from dataclasses import dataclass, field

class Account:
    bank_name = "Brush Up Bank"  # class attribute: shared by all instances

    def __init__(self, owner, balance=0):
        self.owner = owner       # instance attribute
        self._balance = balance  # leading underscore: "internal", not enforced by the language
    @property
    def balance(self):
        return self._balance
    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value
    def __repr__(self):
        return f"Account(owner={self.owner!r}, balance={self._balance})"
    def __str__(self):
        return f"{self.owner}'s account: ${self._balance}"

acct = Account("Nova", 100)
acct.balance = 150  # goes through the @property setter
print(f"str(acct) -> {acct}")
print(f"repr(acct) -> {repr(acct)}")
print(f"class attribute shared: {acct.bank_name}")

# --- inheritance + super() ---
class SavingsAccount(Account):
    def __init__(self, owner, balance, rate):
        super().__init__(owner, balance)  # delegate shared setup to the parent
        self.rate = rate
    @classmethod
    def opened_with_bonus(cls, owner, rate):
        return cls(owner, balance=50, rate=rate)  # cls() so subclasses still work correctly
    @staticmethod
    def apply_rate(amount, rate):
        return amount * (1 + rate)  # no self/cls needed - a plain utility grouped with the class

savings = SavingsAccount.opened_with_bonus("Zoe", 0.05)
print(f"classmethod factory: {savings}, staticmethod apply_rate: {SavingsAccount.apply_rate(100, 0.05)}")

# --- dataclass: frozen, field default_factory, order, __eq__ ---
@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int
    tags: list = field(default_factory=list, compare=False)  # mutable default done safely
p1, p2, p3 = Point(1, 2), Point(1, 2), Point(3, 4)
print(f"dataclass repr: {p1}")
print(f"__eq__ from dataclass: p1 == p2 -> {p1 == p2}")
print(f"order=True enables comparisons: p1 < p3 -> {p1 < p3}")
# p1.x = 99  # <- would fail: frozen=True makes instances immutable

# --- duck typing: no shared base class needed, only matching behavior ---
class Duck:
    def speak(self):
        return "Quack"
class Robot:
    def speak(self):
        return "Beep"
def make_it_speak(thing):  # Python only checks that .speak() exists, not the type
    return thing.speak()

for creature in [Duck(), Robot()]:
    print(f"duck typing: {type(creature).__name__} says {make_it_speak(creature)}")
