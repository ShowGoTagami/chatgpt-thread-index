import type { Question } from './types';
import { CSS_CLASSES, CONFIG } from './utils/domSelectors';

const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 500;
const STORAGE_KEY = 'cgpt-nav-sidebar-width';

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

  // Create resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'cgpt-nav-resize-handle';
  sidebarElement.appendChild(resizeHandle);
  setupResizeHandler(resizeHandle, sidebarElement);

  // Create header
  const header = document.createElement('header');
  header.className = CSS_CLASSES.HEADER;
  header.textContent = 'Chat';
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
 * Sets up the resize handler for dragging the sidebar width
 */
function setupResizeHandler(handle: HTMLElement, sidebar: HTMLElement): void {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  // Load saved width
  const savedWidth = localStorage.getItem(STORAGE_KEY);
  if (savedWidth) {
    const width = parseInt(savedWidth, 10);
    if (width >= MIN_SIDEBAR_WIDTH && width <= MAX_SIDEBAR_WIDTH) {
      sidebar.style.width = `${width}px`;
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = startX - e.clientX;
    const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, startWidth + deltaX));
    sidebar.style.width = `${newWidth}px`;
  };

  const onMouseUp = () => {
    if (!isResizing) return;

    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Save width to localStorage
    const currentWidth = sidebar.offsetWidth;
    localStorage.setItem(STORAGE_KEY, String(currentWidth));

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  handle.addEventListener('mousedown', (e: MouseEvent) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;

    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    e.preventDefault();
  });
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
