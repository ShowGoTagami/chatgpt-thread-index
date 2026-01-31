import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDOMMonitor } from './domMonitor';

describe('domMonitor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  // Helper to flush microtasks (MutationObserver callbacks)
  const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

  describe('createDOMMonitor', () => {
    it('should create a monitor with startObserving, stopObserving, and isObserving methods', () => {
      const monitor = createDOMMonitor(300);
      expect(typeof monitor.startObserving).toBe('function');
      expect(typeof monitor.stopObserving).toBe('function');
      expect(typeof monitor.isObserving).toBe('function');
    });

    it('should report not observing initially', () => {
      const monitor = createDOMMonitor(300);
      expect(monitor.isObserving()).toBe(false);
    });

    it('should report observing after startObserving is called', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const monitor = createDOMMonitor(300);
      monitor.startObserving(container, vi.fn());

      expect(monitor.isObserving()).toBe(true);

      monitor.stopObserving();
    });

    it('should report not observing after stopObserving is called', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const monitor = createDOMMonitor(300);
      monitor.startObserving(container, vi.fn());
      monitor.stopObserving();

      expect(monitor.isObserving()).toBe(false);
    });

    it('should invoke callback when DOM changes are detected (debounced)', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const callback = vi.fn();
      const monitor = createDOMMonitor(300);
      monitor.startObserving(container, callback);

      // Add a child to trigger mutation
      const child = document.createElement('span');
      container.appendChild(child);

      // Flush MutationObserver microtasks
      await vi.advanceTimersByTimeAsync(0);

      // Should not be called immediately (debounce not elapsed)
      expect(callback).not.toHaveBeenCalled();

      // Wait for debounce
      await vi.advanceTimersByTimeAsync(300);

      // Now it should be called
      expect(callback).toHaveBeenCalledTimes(1);

      monitor.stopObserving();
    });

    it('should debounce multiple rapid mutations into single callback', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const callback = vi.fn();
      const monitor = createDOMMonitor(300);
      monitor.startObserving(container, callback);

      // Add multiple children rapidly
      for (let i = 0; i < 5; i++) {
        const child = document.createElement('span');
        container.appendChild(child);
        await vi.advanceTimersByTimeAsync(50);
      }

      // At this point 250ms have passed, callback should not be called yet
      expect(callback).not.toHaveBeenCalled();

      // Wait for remaining debounce time
      await vi.advanceTimersByTimeAsync(300);

      // Should only be called once
      expect(callback).toHaveBeenCalledTimes(1);

      monitor.stopObserving();
    });

    it('should not invoke callback after stopObserving', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const callback = vi.fn();
      const monitor = createDOMMonitor(300);
      monitor.startObserving(container, callback);

      // Stop observing
      monitor.stopObserving();

      // Add a child
      const child = document.createElement('span');
      container.appendChild(child);

      // Wait for debounce
      await vi.advanceTimersByTimeAsync(300);

      // Should not be called
      expect(callback).not.toHaveBeenCalled();
    });

    it('should prevent duplicate observers on the same container', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const monitor = createDOMMonitor(300);

      monitor.startObserving(container, callback1);
      monitor.startObserving(container, callback2);

      // Add a child
      const child = document.createElement('span');
      container.appendChild(child);

      await vi.advanceTimersByTimeAsync(300);

      // Only the second callback should be active
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);

      monitor.stopObserving();
    });
  });
});
