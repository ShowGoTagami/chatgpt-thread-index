import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToElement } from './scrollController';

describe('scrollController', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('scrollToElement', () => {
    it('should scroll to element position with default offset', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 500,
        left: 0,
        bottom: 550,
        right: 100,
        width: 100,
        height: 50,
      });
      document.body.appendChild(element);

      // Mock window.scrollY
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      scrollToElement(element);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 500 - 80, // element top - default offset
        behavior: 'smooth',
      });
    });

    it('should use custom offset when provided', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 500,
        left: 0,
        bottom: 550,
        right: 100,
        width: 100,
        height: 50,
      });
      document.body.appendChild(element);

      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      scrollToElement(element, 100);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 500 - 100,
        behavior: 'smooth',
      });
    });

    it('should account for current scroll position', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 200, // This is relative to viewport
        left: 0,
        bottom: 250,
        right: 100,
        width: 100,
        height: 50,
      });
      document.body.appendChild(element);

      // Already scrolled 300px
      Object.defineProperty(window, 'scrollY', { value: 300, writable: true });

      scrollToElement(element);

      // Final position = current scroll + element's viewport offset - offset
      // = 300 + 200 - 80 = 420
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 420,
        behavior: 'smooth',
      });
    });

    it('should handle element that might be removed from DOM gracefully', () => {
      const element = document.createElement('div');
      // Element not in DOM - getBoundingClientRect still works but returns zeros
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
      });

      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      // Should not throw
      expect(() => scrollToElement(element)).not.toThrow();
    });

    it('should use smooth scroll behavior', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 0,
        bottom: 150,
        right: 100,
        width: 100,
        height: 50,
      });
      document.body.appendChild(element);

      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      scrollToElement(element);

      expect(mockScrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      );
    });
  });
});
