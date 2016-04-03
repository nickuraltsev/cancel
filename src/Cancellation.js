import CancellationError from './CancellationError';

const noop = () => {};

export default class Cancellation {
  internalIsCanceled = false;
  listeners = [];

  /**
   * Returns `true` if cancellation has been requested; otherwise, returns `false`.
   */
  isCanceled() {
    return this.internalIsCanceled;
  }

  /**
   * Issues a cancellation request.
   *
   * It is safe to call this method multiple times since all but the first call are ignored.
   */
  cancel() {
    // Return if cancellation has already been requested.
    if (this.internalIsCanceled) {
      return;
    }

    this.internalIsCanceled = true;

    // Notify and remove listeners
    this.listeners.forEach(listener => listener());
    this.listeners = null;
  }

  /**
   * Throws a `CancellationError` if cancellation has been requested.
   */
  throwIfCanceled() {
    if (this.internalIsCanceled) {
      throw new CancellationError('Operation has been canceled.');
    }
  }

  /**
   * Adds a listener to be notified when cancellation is requested.
   *
   * @param {Function} listener The function to be called when cancellation is requested.
   * @returns {Function} A function that, when called, removes the listener.
   */
  onCancel(listener) {
    if (this.internalIsCanceled) {
      return noop;
    }

    this.listeners.push(listener);

    return () => {
      if (this.listeners) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }
}
