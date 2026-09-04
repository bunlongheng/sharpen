# Step 10: Async - coroutines, gather, tasks, semaphores, async generators
# - Calling an `async def` function does NOT run it - it returns a coroutine object. Only
#   `await` (or scheduling it, e.g. via gather/create_task) actually runs the body.
# - asyncio.gather runs coroutines concurrently and returns results in the SAME order they were
#   passed in, regardless of which one finishes first.
# - create_task schedules a coroutine to start running now (on the event loop), so work begins
#   before you `await` it - useful for firing off concurrent work early.
# - `await` inside a for-loop is a classic mistake: each iteration fully finishes before the
#   next starts, so nothing overlaps - it's really sequential code wearing async syntax.
# - Semaphore(2) caps how many coroutines run a critical section at once, deterministic here
#   because every sleep uses the same tiny duration and tasks are created in a fixed order.

import asyncio

async def say_hello():
    return "hello"

async def labeled_sleep(label, delay):
    await asyncio.sleep(delay)
    return label

async def worker(sem, n):
    async with sem:
        print(f"  start {n}")
        await asyncio.sleep(0.01)
        print(f"  end {n}")

async def counter(limit):
    for i in range(limit):
        await asyncio.sleep(0.01)
        yield i

async def main():
    # coroutine vs calling it: calling say_hello() alone just builds a coroutine object.
    coro = say_hello()
    print(f"calling without await -> {type(coro).__name__}")
    print(f"awaiting it -> {await coro}")

    # asyncio.gather: results come back in input order, not completion order.
    gathered = await asyncio.gather(labeled_sleep("a", 0.02), labeled_sleep("b", 0.01))
    print(f"gather preserves input order: {gathered}")

    # create_task: schedules both immediately, they run concurrently while we await them.
    t1 = asyncio.create_task(labeled_sleep("t1", 0.01))
    t2 = asyncio.create_task(labeled_sleep("t2", 0.01))
    print(f"create_task results: {await t1}, {await t2}")

    # Mistake: await inside a loop always completes in input order, no overlap - the delays
    # never actually race each other.
    delays = [("slow", 0.03), ("medium", 0.02), ("fast", 0.01)]
    sequential_order = []
    for label, delay in delays:
        await asyncio.sleep(delay)
        sequential_order.append(label)
    print(f"await-in-a-loop (sequential) order: {sequential_order}")

    # Fix: run them concurrently and observe REAL completion order via as_completed.
    concurrent_order = []
    for finished in asyncio.as_completed([labeled_sleep(l, d) for l, d in delays]):
        concurrent_order.append(await finished)
    print(f"gather/as_completed (concurrent) completion order: {concurrent_order}")

    # Semaphore(2): only 2 workers run their critical section at once; deterministic since all
    # sleeps are equal and tasks are created in the same order every run.
    sem = asyncio.Semaphore(2)
    await asyncio.gather(*(worker(sem, n) for n in range(1, 5)))

    # Async generator: `async for` pulls values one at a time, awaiting between each.
    values = [v async for v in counter(3)]
    print(f"async generator values: {values}")

asyncio.run(main())
