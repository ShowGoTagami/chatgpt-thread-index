import type { Question } from '../types';
import { DOM_SELECTORS, CONFIG } from './domSelectors';

/**
 * Formats text for display by replacing newlines and truncating if needed
 *
 * @param text - The raw text to format
 * @param maxLength - Maximum characters before truncation
 * @returns Formatted display text
 */
export function formatDisplayText(text: string, maxLength: number = CONFIG.MAX_DISPLAY_LENGTH): string {
  // Replace newlines with spaces
  const normalized = text.replace(/\n/g, ' ');

  // Truncate if needed
  if (normalized.length > maxLength) {
    return normalized.slice(0, maxLength) + CONFIG.ELLIPSIS;
  }

  return normalized;
}

/**
 * Extracts all user questions from the current DOM state
 *
 * @returns Array of Question objects in chronological order
 */
export function extractQuestions(): Question[] {
  const userMessageElements = document.querySelectorAll(DOM_SELECTORS.USER_MESSAGE);

  if (userMessageElements.length === 0) {
    return [];
  }

  const questions: Question[] = [];

  userMessageElements.forEach((element, index) => {
    const rawText = element.textContent || '';
    const fullText = rawText.replace(/\n/g, ' ');
    const displayText = formatDisplayText(fullText);

    questions.push({
      id: `question-${index}`,
      index,
      label: `Q${index + 1}`,
      fullText,
      displayText,
      element,
    });
  });

  return questions;
}
