import { findChatContainer, CONFIG } from './utils/domSelectors';
import { extractQuestions } from './utils/questionExtractor';
import { scrollToElement } from './utils/scrollController';
import { createDOMMonitor, type DOMMonitor } from './utils/domMonitor';
import {
  createSidebar,
  updateQuestions,
  setOnQuestionClick,
  setSelectedQuestion,
  getQuestions,
} from './sidebar';
import { logError, logInfo, logWarning, safeExecute } from './utils/errorHandler';
import type { Question } from './types';

let domMonitor: DOMMonitor | null = null;
let isInitialized = false;

/**
 * Waits for the chat container with exponential backoff retry
 */
async function waitForChatContainer(): Promise<Element | null> {
  for (let attempt = 0; attempt < CONFIG.MAX_RETRY_ATTEMPTS; attempt++) {
    const container = findChatContainer();
    if (container) {
      return container;
    }

    const delay = CONFIG.RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
    logInfo(`Chat container not found, retrying in ${delay}ms (attempt ${attempt + 1}/${CONFIG.MAX_RETRY_ATTEMPTS})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return null;
}

/**
 * Handles question click - scrolls to the question element
 */
function handleQuestionClick(question: Question): void {
  safeExecute(
    () => {
      scrollToElement(question.element);
    },
    undefined,
    'handleQuestionClick'
  );
}

/**
 * Refreshes the question list from the DOM
 */
function refreshQuestionList(): void {
  safeExecute(
    () => {
      const questions = extractQuestions();
      const currentQuestions = getQuestions();

      // Preserve selection if selected question still exists
      const selectedItem = document.querySelector('.cgpt-nav-item--selected');
      const selectedId = selectedItem
        ? (selectedItem as HTMLElement).dataset.questionId
        : null;

      updateQuestions(questions);

      // Restore selection if the question still exists
      if (selectedId) {
        const stillExists = questions.some((q) => q.id === selectedId);
        if (stillExists) {
          setSelectedQuestion(selectedId);
        }
      }
    },
    undefined,
    'refreshQuestionList'
  );
}

/**
 * Sets up the DOM observer for real-time updates
 */
function setupDOMObserver(container: Element): void {
  domMonitor = createDOMMonitor(CONFIG.DEBOUNCE_MS);
  domMonitor.startObserving(container, refreshQuestionList);
  logInfo('DOM observer initialized');
}

/**
 * Main initialization function
 */
async function initialize(): Promise<void> {
  if (isInitialized) {
    logWarning('initialize', 'Extension already initialized');
    return;
  }

  logInfo('Initializing ChatGPT Question Navigator...');

  // Wait for chat container
  const container = await waitForChatContainer();
  if (!container) {
    logWarning('initialize', 'Chat container not found after retries. Extension disabled.');
    return;
  }

  logInfo('Chat container found');

  // Create and inject sidebar
  safeExecute(
    () => {
      createSidebar();
      setOnQuestionClick(handleQuestionClick);
    },
    undefined,
    'createSidebar'
  );

  // Extract initial questions
  safeExecute(
    () => {
      const questions = extractQuestions();
      updateQuestions(questions);
      logInfo(`Found ${questions.length} initial questions`);
    },
    undefined,
    'extractInitialQuestions'
  );

  // Set up DOM observer for real-time updates
  safeExecute(
    () => {
      setupDOMObserver(container);
    },
    undefined,
    'setupDOMObserver'
  );

  isInitialized = true;
  logInfo('ChatGPT Question Navigator initialized successfully');
}

/**
 * Handles SPA navigation by re-initializing when the URL changes
 */
function setupSPANavigationHandler(): void {
  let lastUrl = window.location.href;

  // Use MutationObserver to detect URL changes in SPA
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      logInfo('URL changed, re-initializing...');

      // Clean up existing observer
      if (domMonitor) {
        domMonitor.stopObserving();
        domMonitor = null;
      }

      // Reset state
      isInitialized = false;

      // Re-initialize after a short delay to let the DOM settle
      setTimeout(() => {
        initialize().catch((error) => {
          logError('re-initialize', error);
        });
      }, 500);
    }
  });

  // Observe document for any changes that might indicate navigation
  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initialize().catch((error) => {
      logError('DOMContentLoaded initialization', error);
    });
    setupSPANavigationHandler();
  });
} else {
  initialize().catch((error) => {
    logError('immediate initialization', error);
  });
  setupSPANavigationHandler();
}
