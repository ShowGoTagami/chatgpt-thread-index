import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSidebar, updateQuestions, setSelectedQuestion, destroySidebar } from './sidebar';
import type { Question } from './types';

describe('sidebar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const createMockQuestion = (index: number): Question => ({
    id: `question-${index}`,
    index,
    label: `Q${index + 1}`,
    fullText: `Full text for question ${index + 1}`,
    displayText: `Display text for question ${index + 1}`,
    element: document.createElement('div'),
  });

  describe('createSidebar', () => {
    it('should create a fixed-position sidebar element', () => {
      const sidebar = createSidebar();
      expect(sidebar).toBeInstanceOf(HTMLElement);
      expect(sidebar.classList.contains('cgpt-nav-sidebar')).toBe(true);
    });

    it('should inject sidebar into document body', () => {
      createSidebar();
      const sidebar = document.querySelector('.cgpt-nav-sidebar');
      expect(sidebar).not.toBeNull();
    });

    it('should include a header section', () => {
      createSidebar();
      const header = document.querySelector('.cgpt-nav-header');
      expect(header).not.toBeNull();
      expect(header?.textContent).toContain('Questions');
    });

    it('should include a scrollable list container', () => {
      createSidebar();
      const list = document.querySelector('.cgpt-nav-list');
      expect(list).not.toBeNull();
    });
  });

  describe('updateQuestions', () => {
    it('should render questions as list items', () => {
      createSidebar();
      const questions = [createMockQuestion(0), createMockQuestion(1)];
      updateQuestions(questions);

      const items = document.querySelectorAll('.cgpt-nav-item');
      expect(items).toHaveLength(2);
    });

    it('should display question labels Q1, Q2...', () => {
      createSidebar();
      const questions = [createMockQuestion(0), createMockQuestion(1)];
      updateQuestions(questions);

      const labels = document.querySelectorAll('.cgpt-nav-label');
      expect(labels[0]?.textContent).toBe('Q1');
      expect(labels[1]?.textContent).toBe('Q2');
    });

    it('should display truncated preview text', () => {
      createSidebar();
      const questions = [createMockQuestion(0)];
      updateQuestions(questions);

      const text = document.querySelector('.cgpt-nav-text');
      expect(text?.textContent).toBe('Display text for question 1');
    });

    it('should show empty state message when no questions', () => {
      createSidebar();
      updateQuestions([]);

      const empty = document.querySelector('.cgpt-nav-empty');
      expect(empty).not.toBeNull();
      expect(empty?.textContent).toContain('No questions');
    });

    it('should clear previous items before rendering new ones', () => {
      createSidebar();
      updateQuestions([createMockQuestion(0), createMockQuestion(1)]);
      updateQuestions([createMockQuestion(0)]);

      const items = document.querySelectorAll('.cgpt-nav-item');
      expect(items).toHaveLength(1);
    });
  });

  describe('setSelectedQuestion', () => {
    it('should add selected class to the matching question item', () => {
      createSidebar();
      const questions = [createMockQuestion(0), createMockQuestion(1)];
      updateQuestions(questions);

      setSelectedQuestion('question-0');

      const items = document.querySelectorAll('.cgpt-nav-item');
      expect(items[0]?.classList.contains('cgpt-nav-item--selected')).toBe(true);
      expect(items[1]?.classList.contains('cgpt-nav-item--selected')).toBe(false);
    });

    it('should remove selected class from previously selected item', () => {
      createSidebar();
      const questions = [createMockQuestion(0), createMockQuestion(1)];
      updateQuestions(questions);

      setSelectedQuestion('question-0');
      setSelectedQuestion('question-1');

      const items = document.querySelectorAll('.cgpt-nav-item');
      expect(items[0]?.classList.contains('cgpt-nav-item--selected')).toBe(false);
      expect(items[1]?.classList.contains('cgpt-nav-item--selected')).toBe(true);
    });

    it('should clear selection when passed null', () => {
      createSidebar();
      const questions = [createMockQuestion(0)];
      updateQuestions(questions);

      setSelectedQuestion('question-0');
      setSelectedQuestion(null);

      const items = document.querySelectorAll('.cgpt-nav-item');
      expect(items[0]?.classList.contains('cgpt-nav-item--selected')).toBe(false);
    });
  });

  describe('destroySidebar', () => {
    it('should remove sidebar from DOM', () => {
      createSidebar();
      expect(document.querySelector('.cgpt-nav-sidebar')).not.toBeNull();

      destroySidebar();
      expect(document.querySelector('.cgpt-nav-sidebar')).toBeNull();
    });
  });
});
