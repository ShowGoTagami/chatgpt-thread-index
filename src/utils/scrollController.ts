const HIGHLIGHT_CLASS = 'cgpt-nav-highlight';
const HIGHLIGHT_DURATION_MS = 2000;

let currentHighlightedElement: Element | null = null;
let highlightTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Removes highlight from the currently highlighted element
 */
function removeCurrentHighlight(): void {
  if (highlightTimeoutId) {
    clearTimeout(highlightTimeoutId);
    highlightTimeoutId = null;
  }

  if (currentHighlightedElement) {
    currentHighlightedElement.classList.remove(HIGHLIGHT_CLASS);
    currentHighlightedElement = null;
  }
}

/**
 * Adds highlight to an element with auto-removal after duration
 */
function highlightElement(element: Element): void {
  // Remove any existing highlight first
  removeCurrentHighlight();

  // Add highlight class
  element.classList.add(HIGHLIGHT_CLASS);
  currentHighlightedElement = element;

  // Auto-remove highlight after animation completes
  highlightTimeoutId = setTimeout(() => {
    element.classList.remove(HIGHLIGHT_CLASS);
    if (currentHighlightedElement === element) {
      currentHighlightedElement = null;
    }
    highlightTimeoutId = null;
  }, HIGHLIGHT_DURATION_MS);
}

/**
 * Scrolls to bring the target element into view and highlights it
 * Uses scrollIntoView which works with any scroll container
 *
 * @param element - The DOM element to scroll to
 */
export function scrollToElement(element: Element): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  // Highlight after a short delay to let scroll settle
  setTimeout(() => {
    highlightElement(element);
  }, 300);
}
