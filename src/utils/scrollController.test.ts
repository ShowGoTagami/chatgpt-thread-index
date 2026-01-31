import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToElement } from './scrollController';

describe('scrollController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('scrollToElement', () => {
    it('should call scrollIntoView on the element', () => {
      const element = document.createElement('div');
      element.scrollIntoView = vi.fn();
      document.body.appendChild(element);

      scrollToElement(element);

      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should use smooth scroll behavior', () => {
      const element = document.createElement('div');
      element.scrollIntoView = vi.fn();
      document.body.appendChild(element);

      scrollToElement(element);

      expect(element.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      );
    });

    it('should add highlight class after scroll delay', () => {
      const element = document.createElement('div');
      element.scrollIntoView = vi.fn();
      document.body.appendChild(element);

      scrollToElement(element);

      // Before delay, no highlight
      expect(element.classList.contains('cgpt-nav-highlight')).toBe(false);

      // After 300ms delay, highlight should be added
      vi.advanceTimersByTime(300);
      expect(element.classList.contains('cgpt-nav-highlight')).toBe(true);
    });

    it('should remove highlight class after duration', () => {
      const element = document.createElement('div');
      element.scrollIntoView = vi.fn();
      document.body.appendChild(element);

      scrollToElement(element);

      // After scroll delay
      vi.advanceTimersByTime(300);
      expect(element.classList.contains('cgpt-nav-highlight')).toBe(true);

      // After highlight duration (2000ms)
      vi.advanceTimersByTime(2000);
      expect(element.classList.contains('cgpt-nav-highlight')).toBe(false);
    });

    it('should remove previous highlight when new element is scrolled to', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      element1.scrollIntoView = vi.fn();
      element2.scrollIntoView = vi.fn();
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      // Scroll to first element
      scrollToElement(element1);
      vi.advanceTimersByTime(300);
      expect(element1.classList.contains('cgpt-nav-highlight')).toBe(true);

      // Scroll to second element before first highlight expires
      scrollToElement(element2);
      vi.advanceTimersByTime(300);

      // First element should no longer be highlighted
      expect(element1.classList.contains('cgpt-nav-highlight')).toBe(false);
      // Second element should be highlighted
      expect(element2.classList.contains('cgpt-nav-highlight')).toBe(true);
    });
  });
});
