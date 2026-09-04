// Step 10: Async/Await - Task, WhenAll, cancellation, ConfigureAwait, the async void trap
// - async/await lets code that waits on I/O (Task.Delay stands in for it here) yield the thread
//   instead of blocking it, then resume where it left off once the awaited task completes.
// - Task.WhenAll runs multiple tasks concurrently and completes when all of them finish; the
//   results array preserves the original task order, not completion order, so it stays deterministic.
// - A CancellationToken lets calling code request cooperative cancellation; the running work must
//   observe it (Task.Delay does this itself) and it throws OperationCanceledException.
// - ConfigureAwait(false) skips capturing the original synchronization context on resume; it
//   matters in UI/ASP.NET classic apps, and is a safe no-op-ish default in library/console code.

async Task<string> FetchAsync(string name, int delayMs)
{
    await Task.Delay(delayMs);  // stands in for real I/O like a network or DB call
    return $"{name} done";
}

// --- await a single task ---
string result = await FetchAsync("first", 10);
Console.WriteLine($"single await: {result}");

// --- Task.WhenAll with deterministic ordered results ---
Task<string> taskA = FetchAsync("A", 10);
Task<string> taskB = FetchAsync("B", 10);
Task<string> taskC = FetchAsync("C", 10);
string[] results = await Task.WhenAll(taskA, taskB, taskC);
Console.WriteLine($"WhenAll preserves input order: [{string.Join(", ", results)}]");

// --- cancellation ---
async Task DoCancellableWorkAsync(CancellationToken token)
{
    await Task.Delay(50, token);  // Task.Delay observes the token and throws when cancelled
}

using var cts = new CancellationTokenSource();
cts.Cancel();  // cancel immediately, before the work even starts, for deterministic output
try
{
    await DoCancellableWorkAsync(cts.Token);
    Console.WriteLine("cancellation: work completed (unexpected)");
}
catch (OperationCanceledException)
{
    Console.WriteLine("cancellation: caught OperationCanceledException as expected");
}

// --- ConfigureAwait note ---
await Task.Delay(10).ConfigureAwait(false);
Console.WriteLine("ConfigureAwait(false): resumed without capturing the original context");

// Interview notes:
// - Common mistake: `async void` methods cannot be awaited and any exception they throw cannot
//   be caught by the caller - it crashes the process instead. Only use async void for top-level
//   UI event handlers; everything else should be async Task.
// - Common mistake: calling .Result or .Wait() on a Task from synchronous code can deadlock in
//   contexts with a synchronization context (classic ASP.NET, WPF); prefer await end-to-end.
