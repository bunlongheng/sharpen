// Step 10: Concurrency - thread::spawn + join, Arc<Mutex<T>>, mpsc channels, Send/Sync
// - thread::spawn runs a closure on a new OS thread; join() blocks until it finishes and
//   returns its result - without join, main could exit before spawned threads finish.
// - A thread closure usually needs `move` to take ownership of captured data, since the new
//   thread might outlive the stack frame that created it.
// - Arc<T> is Rc<T>'s thread-safe sibling (atomic ref-counting); Mutex<T> gives exclusive
//   access via lock(), so Arc<Mutex<T>> is the standard shared-mutable-state pattern.
// - mpsc (multi-producer, single-consumer) channels move data between threads via send/recv
//   instead of shared memory - "don't communicate by sharing memory, share memory by communicating".
// - Send means a type can be transferred across threads; Sync means it can be referenced from
//   multiple threads at once. Rc/RefCell are neither; Arc/Mutex are both - that's why the
//   compiler forces the swap when you move from single-threaded to multi-threaded code.

use std::sync::{mpsc, Arc, Mutex};
use std::thread;

fn main() {
    // --- thread::spawn + join, with a moved closure ---
    let greeting = String::from("hello from a thread");
    let handle = thread::spawn(move || {
        format!("{}!", greeting) // greeting was moved in; the thread owns it independently
    });
    let result = handle.join().unwrap(); // blocks until the thread finishes
    println!("joined thread result: {}", result);

    // --- Arc<Mutex<T>>: shared mutable counter across 4 threads ---
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();
    for _ in 0..4 {
        let counter = Arc::clone(&counter); // clone the Arc, not the data - bumps ref count
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                let mut num = counter.lock().unwrap(); // exclusive access while `num` is alive
                *num += 1;
            } // lock released here at end of scope
        }));
    }
    for h in handles {
        h.join().unwrap(); // wait for every worker before reading the final count
    }
    println!("Arc<Mutex<T>> final count (4 threads x 1000): {}", *counter.lock().unwrap());

    // --- mpsc channel: collect results, then sort before printing (arrival order isn't fixed) ---
    let (tx, rx) = mpsc::channel();
    let mut senders = Vec::new();
    for i in 0..5 {
        let tx = tx.clone();
        senders.push(thread::spawn(move || {
            tx.send(i * i).unwrap();
        }));
    }
    drop(tx); // drop the original sender so rx.iter() ends once all clones are dropped
    for s in senders {
        s.join().unwrap();
    }
    let mut results: Vec<i32> = rx.iter().collect();
    results.sort(); // arrival order across threads isn't deterministic - sort for stable output
    println!("mpsc channel results (sorted): {:?}", results);

    // Interview notes:
    // - Arc<Mutex<T>> is the textbook shared-state pattern; channels are the message-passing
    //   alternative - reach for channels first when threads can be decoupled into producer/consumer.
    // - Mutex<T> is Sync only because locking is required to get at the T, so the borrow checker
    //   extends its single-thread aliasing guarantees across threads too.
    // - Send/Sync are auto traits with no methods - the compiler derives them structurally, so
    //   a type built only from Send+Sync parts is automatically Send+Sync too.
}
