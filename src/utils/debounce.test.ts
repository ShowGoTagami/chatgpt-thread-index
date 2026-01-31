import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay callback execution by the specified delay', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only execute the last call within the delay window', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn();
    vi.advanceTimersByTime(100);
    debouncedFn();
    vi.advanceTimersByTime(100);
    debouncedFn();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the callback', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should support cancellation of pending debounced calls', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn();
    vi.advanceTimersByTime(100);
    debouncedFn.cancel();

    vi.advanceTimersByTime(300);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should allow multiple separate debounced functions to work independently', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const debouncedFn1 = debounce(callback1, 300);
    const debouncedFn2 = debounce(callback2, 500);

    debouncedFn1();
    debouncedFn2();

    vi.advanceTimersByTime(300);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
