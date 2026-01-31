import { CONFIG } from './domSelectors';

/**
 * Scrolls the page to bring the target element into view
 *
 * @param element - The DOM element to scroll to
 * @param offsetPx - Pixels from top of viewport (default: 80)
 */
export function scrollToElement(
  element: Element,
  offsetPx: number = CONFIG.SCROLL_OFFSET_PX
): void {
  const rect = element.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  const targetPosition = absoluteTop - offsetPx;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
}
