// Shared scroll lock utility with reference counting
// Prevents body scroll conflicts when multiple features use scroll locking

let lockCount = 0;
const locks = new Set();

/**
 * Acquire a scroll lock
 * @param {string} lockId - Unique identifier for the lock (e.g., 'lightbox', 'header-menu')
 */
export function acquireLock(lockId) {
  if (locks.has(lockId)) {
    console.warn(`Scroll lock "${lockId}" already acquired`);
    return;
  }

  locks.add(lockId);
  lockCount++;

  // Add no-scroll class only when transitioning from 0 to 1
  if (lockCount === 1) {
    document.body.classList.add('no-scroll');
  }
}

/**
 * Release a scroll lock
 * @param {string} lockId - Unique identifier for the lock
 */
export function releaseLock(lockId) {
  if (!locks.has(lockId)) {
    console.warn(`Scroll lock "${lockId}" was not acquired`);
    return;
  }

  locks.delete(lockId);
  lockCount--;

  // Remove no-scroll class only when transitioning from 1 to 0
  if (lockCount === 0) {
    document.body.classList.remove('no-scroll');
  }

  // Safety check
  if (lockCount < 0) {
    console.error('Scroll lock count became negative, resetting');
    lockCount = 0;
    locks.clear();
    document.body.classList.remove('no-scroll');
  }
}

/**
 * Get current lock count (for debugging)
 */
export function getLockCount() {
  return lockCount;
}

/**
 * Get all active locks (for debugging)
 */
export function getActiveLocks() {
  return Array.from(locks);
}
