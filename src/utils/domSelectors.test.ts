import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { findChatContainer, DOM_SELECTORS, CONFIG, CSS_CLASSES } from './domSelectors';

describe('domSelectors', () => {
  describe('DOM_SELECTORS', () => {
    it('should have correct USER_MESSAGE selector', () => {
      expect(DOM_SELECTORS.USER_MESSAGE).toBe('[data-message-author-role="user"]');
    });

    it('should have correct CHAT_CONTAINER selector', () => {
      expect(DOM_SELECTORS.CHAT_CONTAINER).toBe('[role="presentation"]');
    });

    it('should have correct CHAT_CONTAINER_FALLBACK selector', () => {
      expect(DOM_SELECTORS.CHAT_CONTAINER_FALLBACK).toBe('main');
    });
  });

  describe('CONFIG', () => {
    it('should have correct debounce delay', () => {
      expect(CONFIG.DEBOUNCE_MS).toBe(300);
    });

    it('should have correct scroll offset', () => {
      expect(CONFIG.SCROLL_OFFSET_PX).toBe(80);
    });

    it('should have correct max display length', () => {
      expect(CONFIG.MAX_DISPLAY_LENGTH).toBe(80);
    });
  });

  describe('CSS_CLASSES', () => {
    it('should have unique prefix for all classes', () => {
      Object.values(CSS_CLASSES).forEach((className) => {
        expect(className).toMatch(/^cgpt-nav-/);
      });
    });
  });

  describe('findChatContainer', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should return element with role="presentation" as primary selector', () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'presentation');
      container.id = 'primary-container';
      document.body.appendChild(container);

      const result = findChatContainer();
      expect(result).toBe(container);
    });

    it('should fall back to main element if primary selector fails', () => {
      const mainElement = document.createElement('main');
      mainElement.id = 'main-container';
      document.body.appendChild(mainElement);

      const result = findChatContainer();
      expect(result).toBe(mainElement);
    });

    it('should prefer primary selector over fallback', () => {
      const mainElement = document.createElement('main');
      mainElement.id = 'main-container';
      document.body.appendChild(mainElement);

      const primaryContainer = document.createElement('div');
      primaryContainer.setAttribute('role', 'presentation');
      primaryContainer.id = 'primary-container';
      document.body.appendChild(primaryContainer);

      const result = findChatContainer();
      expect(result?.id).toBe('primary-container');
    });

    it('should return null if neither selector finds an element', () => {
      const result = findChatContainer();
      expect(result).toBeNull();
    });
  });
});
