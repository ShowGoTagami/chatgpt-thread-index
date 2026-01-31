/**
 * Represents a user question extracted from the ChatGPT conversation
 */
export interface Question {
  /** Unique identifier for this question instance */
  id: string;

  /** Zero-based index in conversation order */
  index: number;

  /** Display label (e.g., "Q1", "Q2") */
  label: string;

  /** Full question text with newlines replaced by spaces */
  fullText: string;

  /** Truncated text for sidebar display (max 80 chars) */
  displayText: string;

  /** Reference to the DOM element for scroll targeting */
  element: Element;
}

/**
 * Sidebar state managed by SidebarRenderer
 */
export interface SidebarState {
  /** Currently displayed questions */
  questions: Question[];

  /** ID of the currently selected question, or null */
  selectedId: string | null;

  /** Whether sidebar has been injected into DOM */
  isInjected: boolean;
}

/**
 * Configuration for the extension
 */
export interface ExtensionConfig {
  /** Debounce delay in milliseconds for MutationObserver */
  debounceMs: number;

  /** Scroll offset in pixels to prevent header overlap */
  scrollOffsetPx: number;

  /** Maximum characters for question display text */
  maxDisplayLength: number;

  /** Ellipsis string for truncated text */
  ellipsis: string;
}

/**
 * DOM Monitor configuration
 */
export interface DOMMonitorConfig {
  debounceMs: number;
  observerOptions: MutationObserverInit;
}

/**
 * Scroll configuration
 */
export interface ScrollConfig {
  behavior: ScrollBehavior;
  defaultOffsetPx: number;
}
