import { debounce, type DebouncedFunction } from './debounce';

/**
 * DOM Monitor interface
 */
export interface DOMMonitor {
  /**
   * Start observing the chat container for changes
   * @param container - The DOM element to observe
   * @param onMutation - Callback invoked when relevant mutations occur (debounced)
   */
  startObserving(container: Element, onMutation: () => void): void;

  /**
   * Stop observing and clean up resources
   */
  stopObserving(): void;

  /**
   * Check if currently observing
   */
  isObserving(): boolean;
}

/**
 * Creates a DOM Monitor that wraps MutationObserver with debouncing
 *
 * @param debounceMs - Debounce delay in milliseconds
 * @returns DOMMonitor instance
 */
export function createDOMMonitor(debounceMs: number): DOMMonitor {
  let observer: MutationObserver | null = null;
  let debouncedCallback: DebouncedFunction<() => void> | null = null;
  let observing = false;

  const observerOptions: MutationObserverInit = {
    childList: true,
    subtree: true,
  };

  return {
    startObserving(container: Element, onMutation: () => void): void {
      // Clean up any existing observer
      this.stopObserving();

      // Create debounced callback
      debouncedCallback = debounce(onMutation, debounceMs);

      // Create new observer
      observer = new MutationObserver(() => {
        if (debouncedCallback) {
          debouncedCallback();
        }
      });

      // Start observing
      observer.observe(container, observerOptions);
      observing = true;
    },

    stopObserving(): void {
      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (debouncedCallback) {
        debouncedCallback.cancel();
        debouncedCallback = null;
      }

      observing = false;
    },

    isObserving(): boolean {
      return observing;
    },
  };
}
