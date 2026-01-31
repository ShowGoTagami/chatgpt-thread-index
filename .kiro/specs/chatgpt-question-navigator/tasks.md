# Implementation Plan

## Summary

This implementation plan covers the ChatGPT Question Navigator Chrome Extension. Tasks are organized to build foundational utilities first, then layer UI components, and finally wire everything together with the main entry point.

**Total Tasks:** 6 major tasks with 15 sub-tasks

---

- [x] 1. Set up project foundation and build configuration
- [x] 1.1 Initialize Chrome Extension project structure
  - Create package.json with TypeScript and build tool dependencies
  - Configure tsconfig.json for Chrome extension development
  - Set up build script to compile TypeScript to JavaScript
  - Create manifest.json with Manifest V3 configuration
  - Configure content script injection for ChatGPT domains (chat.openai.com and chatgpt.com)
  - _Requirements: 5.1, 5.2 (Page Compatibility - both ChatGPT domains)_

- [x] 1.2 Create shared type definitions and constants
  - Define the Question data structure with id, index, label, text fields, and element reference
  - Define configuration constants for debounce timing, scroll offset, and max text length
  - Create centralized DOM selector constants for user messages and chat container
  - _Requirements: 2.1 (user message selector), 6.5 (stable data attribute selectors)_

---

- [x] 2. Build DOM utilities and question extraction
- [x] 2.1 Implement debounce utility function
  - Create a reusable debounce function that delays callback execution
  - Ensure only the last call within the delay window is executed
  - Support cancellation of pending debounced calls
  - _Requirements: 4.3, 6.2 (debouncing to prevent excessive re-rendering)_

- [x] 2.2 Implement chat container finder with fallback logic
  - Locate the chat container using the primary selector (role="presentation")
  - Fall back to main element if primary selector fails
  - Return null gracefully if neither selector finds an element
  - _Requirements: 6.4 (graceful failure when DOM structure not found)_

- [x] 2.3 Implement question extraction from ChatGPT DOM
  - Query all user message elements using the data-message-author-role attribute
  - Extract text content from each message element
  - Replace newline characters with spaces in extracted text
  - Truncate display text to 80 characters with ellipsis when exceeded
  - Generate sequential labels (Q1, Q2, Q3...) for each question
  - Maintain reference to original DOM element for scroll targeting
  - Return empty array when no questions found
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 (complete question detection)_

---

- [x] 3. Build scroll navigation functionality
- [x] 3.1 Implement smooth scroll to element
  - Calculate target scroll position based on element's position in document
  - Apply configurable pixel offset (default 80px) to prevent header overlap
  - Use smooth scroll behavior for pleasant user experience
  - Handle edge cases where element may have been removed from DOM
  - _Requirements: 3.2, 3.3, 3.4 (scroll positioning with offset and smooth behavior)_

---

- [x] 4. Build sidebar UI component
- [x] 4.1 Create sidebar container and basic structure
  - Create fixed-position sidebar element on the right side of viewport
  - Set sidebar width to 240 pixels and full viewport height
  - Apply high z-index to appear above ChatGPT's native UI
  - Add header section with extension title
  - Create scrollable list container for question items
  - _Requirements: 1.1, 1.2, 1.3, 1.4 (sidebar display specifications)_

- [x] 4.2 Create sidebar styles
  - Style the sidebar container with fixed positioning and dimensions
  - Design question item layout with label and truncated text
  - Implement hover state with background color change
  - Implement selected/active state with distinct visual highlight
  - Style empty state message for when no questions exist
  - Use unique CSS class prefixes to avoid conflicts with ChatGPT styles
  - _Requirements: 1.1, 1.2, 3.1, 3.5 (visual states and styling)_

- [x] 4.3 Implement question list rendering
  - Render array of questions as clickable list items
  - Display question label (Q1, Q2...) and truncated preview text
  - Show empty state message when question array is empty
  - Efficiently update list when questions change (minimize DOM operations)
  - _Requirements: 2.5, 2.6, 6.3 (display order, empty state, efficient rendering)_

- [x] 4.4 Implement question selection and click handling
  - Handle click events on question items
  - Track currently selected question with visual highlight
  - Remove highlight from previously selected question when new one is selected
  - Trigger scroll navigation when question is clicked
  - _Requirements: 3.2, 3.5, 3.6 (click handling and selection state)_

---

- [x] 5. Build DOM change monitoring
- [x] 5.1 Implement MutationObserver wrapper
  - Create observer that monitors chat container for child and subtree changes
  - Apply debouncing to mutation callbacks to prevent excessive processing
  - Provide method to start observing a container element
  - Provide method to stop observing and clean up resources
  - Track observation state to prevent duplicate observers
  - _Requirements: 4.1, 4.3, 4.4, 6.1, 6.2 (DOM monitoring with debounce)_

- [x] 5.2 Handle conversation switching and SPA navigation
  - Detect when chat container is replaced (conversation switch)
  - Re-initialize observer on new container when detected
  - Rebuild question list when conversation context changes
  - _Requirements: 4.5, 5.3 (SPA navigation and conversation switching)_

---

- [x] 6. Integrate components and create main entry point
- [x] 6.1 Implement main content script initialization
  - Wait for document ready state before initialization
  - Locate chat container with retry logic (exponential backoff, 3 attempts)
  - Create and inject sidebar into the page
  - Extract initial questions and populate sidebar
  - Set up DOM observer to monitor for new questions
  - Wire up question click handler to scroll controller
  - _Requirements: 1.5, 4.1, 6.4 (auto-injection, initialization, graceful failure)_

- [x] 6.2 Implement update flow for new questions
  - Connect DOM observer mutations to question re-extraction
  - Update sidebar display when question list changes
  - Preserve selection state when list updates if selected question still exists
  - _Requirements: 4.2, 4.4 (real-time updates)_

- [x] 6.3 Add error handling and logging
  - Wrap all operations with error boundaries to prevent crashes
  - Log errors to console with extension prefix for debugging
  - Ensure ChatGPT interface remains functional even if extension errors
  - Display user-friendly messages in sidebar for recoverable errors
  - _Requirements: 6.4 (graceful failure without breaking host interface)_

---

## Requirements Coverage Matrix

| Requirement | Task Coverage |
|-------------|---------------|
| 1.1-1.5 Sidebar Display | 4.1, 4.2, 6.1 |
| 2.1-2.6 Question Detection | 1.2, 2.3 |
| 3.1-3.6 List Interaction | 3.1, 4.2, 4.4 |
| 4.1-4.5 Real-time Updates | 2.1, 5.1, 5.2, 6.2 |
| 5.1-5.4 Page Compatibility | 1.1, 5.2 |
| 6.1-6.5 Performance & Stability | 2.1, 2.2, 5.1, 6.3 |

---

## Implementation Order

1. **Foundation (Tasks 1.x)**: Project setup, types, selectors
2. **Core Utilities (Tasks 2.x)**: Debounce, container finder, question extractor
3. **Navigation (Task 3.x)**: Scroll controller
4. **UI (Tasks 4.x)**: Sidebar component and styles
5. **Monitoring (Tasks 5.x)**: MutationObserver and SPA handling
6. **Integration (Tasks 6.x)**: Entry point wiring and error handling
