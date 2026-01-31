/**
 * Centralized DOM selectors for ChatGPT page elements
 * Using data attributes for stability across UI updates
 */
export const DOM_SELECTORS = {
  /** Selector for user message elements */
  USER_MESSAGE: '[data-message-author-role="user"]',

  /** Primary selector for chat container */
  CHAT_CONTAINER: '[role="presentation"]',

  /** Fallback selector for chat container */
  CHAT_CONTAINER_FALLBACK: 'main',
} as const;

/**
 * Extension configuration constants
 */
export const CONFIG = {
  /** Debounce delay in milliseconds for MutationObserver */
  DEBOUNCE_MS: 300,

  /** Scroll offset in pixels to prevent header overlap */
  SCROLL_OFFSET_PX: 80,

  /** Maximum characters for question display text */
  MAX_DISPLAY_LENGTH: 80,

  /** Ellipsis string for truncated text */
  ELLIPSIS: '...',

  /** Sidebar width in pixels */
  SIDEBAR_WIDTH: 240,

  /** Sidebar z-index */
  SIDEBAR_Z_INDEX: 10000,

  /** Maximum retry attempts for finding chat container */
  MAX_RETRY_ATTEMPTS: 3,

  /** Base delay for exponential backoff (ms) */
  RETRY_BASE_DELAY_MS: 500,
} as const;

/**
 * CSS class names for sidebar elements
 * Using unique prefix to avoid conflicts with ChatGPT styles
 */
export const CSS_CLASSES = {
  SIDEBAR: 'cgpt-nav-sidebar',
  HEADER: 'cgpt-nav-header',
  LIST: 'cgpt-nav-list',
  ITEM: 'cgpt-nav-item',
  ITEM_HOVER: 'cgpt-nav-item--hover',
  ITEM_SELECTED: 'cgpt-nav-item--selected',
  LABEL: 'cgpt-nav-label',
  TEXT: 'cgpt-nav-text',
  EMPTY: 'cgpt-nav-empty',
} as const;

/**
 * Find the chat container element, trying primary selector then fallback
 * @returns The container element or null if not found
 */
export function findChatContainer(): Element | null {
  const primary = document.querySelector(DOM_SELECTORS.CHAT_CONTAINER);
  if (primary) {
    return primary;
  }

  const fallback = document.querySelector(DOM_SELECTORS.CHAT_CONTAINER_FALLBACK);
  return fallback;
}
