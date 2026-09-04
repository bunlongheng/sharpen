// Step 8: Exceptions - try/catch/finally, filters, custom exceptions, throw vs throw ex, IDisposable
// - catch blocks are checked top to bottom; put more specific exception types before general
//   ones (like Exception), or the specific catch becomes unreachable dead code (compiler error).
// - Exception filters (catch (T ex) when (condition)) let a catch block apply only when the
//   condition is true, without needing to rethrow and re-catch to check it manually.
// - `throw;` (no expression) rethrows and preserves the original stack trace; `throw ex;`
//   resets the stack trace to the rethrow point, hiding where the exception actually happened.
// - `using` guarantees Dispose() runs even if an exception is thrown inside the block, the same
//   way finally does, but scoped to the resource automatically.

void Withdraw(decimal balance, decimal amount)
{
    if (amount > balance) throw new InsufficientFundsException(amount - balance);
}

// --- try/catch/finally, specific before general ---
try
{
    Withdraw(100m, 150m);
}
catch (InsufficientFundsException ex)  // specific: must come before the general Exception catch
{
    Console.WriteLine($"caught specific: {ex.Message}, shortfall={ex.Shortfall:F2}");
}
catch (Exception ex) { Console.WriteLine($"caught general: {ex.Message}"); }
finally { Console.WriteLine("finally: always runs, cleanup here"); }

// --- exception filter with when ---
try
{
    throw new InvalidOperationException("retryable failure");
}
catch (InvalidOperationException ex) when (ex.Message.Contains("retryable"))
{
    Console.WriteLine($"exception filter matched: {ex.Message}");
}
catch (InvalidOperationException ex) { Console.WriteLine($"filter did not match: {ex.Message}"); }

// --- throw vs throw ex ---
void Rethrow(bool preserveStack)
{
    try
    {
        throw new Exception("original failure");
    }
    catch (Exception ex)
    {
        if (preserveStack)
            throw;      // preserves the original stack trace
#pragma warning disable CA2200 // intentional: demonstrating the throw-ex anti-pattern on purpose
        else
            throw ex;   // resets the stack trace to this line - loses where it really happened
#pragma warning restore CA2200
    }
}
try { Rethrow(true); } catch (Exception ex) { Console.WriteLine($"throw; preserves origin: {ex.Message}"); }

// --- using + IDisposable ---
using (var resource = new Resource("db-connection"))
{
    Console.WriteLine($"using resource: {resource.Name}");
}  // Dispose() runs here, even if an exception had been thrown inside the block

class InsufficientFundsException : Exception
{
    public decimal Shortfall { get; }
    public InsufficientFundsException(decimal shortfall)
        : base($"Insufficient funds, short by {shortfall:F2}")
        => Shortfall = shortfall;
}

class Resource : IDisposable
{
    public string Name { get; }
    public Resource(string name) { Name = name; Console.WriteLine($"Resource '{Name}' opened"); }
    public void Dispose() => Console.WriteLine($"Resource '{Name}' disposed");
}

// Interview notes:
// - Common mistake: putting `catch (Exception)` before a more specific catch makes the specific
//   one unreachable - the compiler flags this as an error, not just a warning.
// - Exception filters (when) do not unwind the stack to evaluate the condition, unlike catching
//   and rethrowing manually, which is why they are preferred for conditional handling.
