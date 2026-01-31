import type { Question } from './types';
import { CSS_CLASSES } from './utils/domSelectors';

let sidebarElement: HTMLElement | null = null;
let listElement: HTMLElement | null = null;
let onQuestionClickCallback: ((question: Question) => void) | null = null;
let currentQuestions: Question[] = [];

/**
 * Creates and injects the sidebar into the page
 * @returns The created sidebar container element
 */
export function createSidebar(): HTMLElement {
  // Remove existing sidebar if present
  destroySidebar();

  // Create sidebar container
  sidebarElement = document.createElement('aside');
  sidebarElement.className = CSS_CLASSES.SIDEBAR;

  // Create header
  const header = document.createElement('header');
  header.className = CSS_CLASSES.HEADER;
  header.textContent = 'Questions';
  sidebarElement.appendChild(header);

  // Create list container
  listElement = document.createElement('ul');
  listElement.className = CSS_CLASSES.LIST;
  sidebarElement.appendChild(listElement);

  // Inject into page
  document.body.appendChild(sidebarElement);

  // Show empty state initially
  showEmptyState();

  return sidebarElement;
}

/**
 * Sets the callback for when a question is clicked
 * @param callback - Function to call with the clicked question
 */
export function setOnQuestionClick(callback: (question: Question) => void): void {
  onQuestionClickCallback = callback;
}

/**
 * Updates the sidebar content with a new question list
 * @param questions - Array of questions to display
 */
export function updateQuestions(questions: Question[]): void {
  if (!listElement) return;

  currentQuestions = questions;

  // Clear existing content
  listElement.innerHTML = '';

  if (questions.length === 0) {
    showEmptyState();
    return;
  }

  // Render question items
  questions.forEach((question) => {
    const item = createQuestionItem(question);
    listElement!.appendChild(item);
  });
}

/**
 * Creates a question list item element
 */
function createQuestionItem(question: Question): HTMLElement {
  const item = document.createElement('li');
  item.className = CSS_CLASSES.ITEM;
  item.dataset.questionId = question.id;

  const label = document.createElement('span');
  label.className = CSS_CLASSES.LABEL;
  label.textContent = question.label;

  const text = document.createElement('span');
  text.className = CSS_CLASSES.TEXT;
  text.textContent = question.displayText;

  item.appendChild(label);
  item.appendChild(text);

  // Add click handler
  item.addEventListener('click', () => {
    setSelectedQuestion(question.id);
    if (onQuestionClickCallback) {
      onQuestionClickCallback(question);
    }
  });

  return item;
}

/**
 * Shows the empty state message
 */
function showEmptyState(): void {
  if (!listElement) return;

  const emptyState = document.createElement('li');
  emptyState.className = CSS_CLASSES.EMPTY;
  emptyState.textContent = 'No questions yet';
  listElement.appendChild(emptyState);
}

/**
 * Sets the currently selected question (visual highlight)
 * @param questionId - ID of question to select, or null to clear selection
 */
export function setSelectedQuestion(questionId: string | null): void {
  if (!listElement) return;

  // Remove previous selection
  const previouslySelected = listElement.querySelector(`.${CSS_CLASSES.ITEM}--selected`);
  if (previouslySelected) {
    previouslySelected.classList.remove(`${CSS_CLASSES.ITEM}--selected`);
  }

  if (questionId === null) return;

  // Add selection to new item
  const items = listElement.querySelectorAll(`.${CSS_CLASSES.ITEM}`);
  items.forEach((item) => {
    if ((item as HTMLElement).dataset.questionId === questionId) {
      item.classList.add(`${CSS_CLASSES.ITEM}--selected`);
    }
  });
}

/**
 * Gets the current questions
 */
export function getQuestions(): Question[] {
  return currentQuestions;
}

/**
 * Removes the sidebar from DOM and cleans up
 */
export function destroySidebar(): void {
  if (sidebarElement && sidebarElement.parentNode) {
    sidebarElement.parentNode.removeChild(sidebarElement);
  }
  sidebarElement = null;
  listElement = null;
  onQuestionClickCallback = null;
  currentQuestions = [];
}
