import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { extractQuestions, formatDisplayText } from './questionExtractor';

describe('questionExtractor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('extractQuestions', () => {
    it('should return empty array when no user messages exist', () => {
      const result = extractQuestions();
      expect(result).toEqual([]);
    });

    it('should extract user messages using data-message-author-role attribute', () => {
      const userMessage = document.createElement('div');
      userMessage.setAttribute('data-message-author-role', 'user');
      userMessage.textContent = 'What is TypeScript?';
      document.body.appendChild(userMessage);

      const result = extractQuestions();
      expect(result).toHaveLength(1);
      expect(result[0].fullText).toBe('What is TypeScript?');
    });

    it('should not extract assistant messages', () => {
      const assistantMessage = document.createElement('div');
      assistantMessage.setAttribute('data-message-author-role', 'assistant');
      assistantMessage.textContent = 'TypeScript is a programming language.';
      document.body.appendChild(assistantMessage);

      const result = extractQuestions();
      expect(result).toEqual([]);
    });

    it('should replace newline characters with spaces', () => {
      const userMessage = document.createElement('div');
      userMessage.setAttribute('data-message-author-role', 'user');
      userMessage.textContent = 'Line 1\nLine 2\nLine 3';
      document.body.appendChild(userMessage);

      const result = extractQuestions();
      expect(result[0].fullText).toBe('Line 1 Line 2 Line 3');
    });

    it('should generate sequential labels Q1, Q2, Q3...', () => {
      for (let i = 0; i < 3; i++) {
        const userMessage = document.createElement('div');
        userMessage.setAttribute('data-message-author-role', 'user');
        userMessage.textContent = `Question ${i + 1}`;
        document.body.appendChild(userMessage);
      }

      const result = extractQuestions();
      expect(result[0].label).toBe('Q1');
      expect(result[1].label).toBe('Q2');
      expect(result[2].label).toBe('Q3');
    });

    it('should maintain reference to original DOM element', () => {
      const userMessage = document.createElement('div');
      userMessage.setAttribute('data-message-author-role', 'user');
      userMessage.textContent = 'Test question';
      document.body.appendChild(userMessage);

      const result = extractQuestions();
      expect(result[0].element).toBe(userMessage);
    });

    it('should generate unique IDs for each question', () => {
      for (let i = 0; i < 3; i++) {
        const userMessage = document.createElement('div');
        userMessage.setAttribute('data-message-author-role', 'user');
        userMessage.textContent = `Question ${i + 1}`;
        document.body.appendChild(userMessage);
      }

      const result = extractQuestions();
      const ids = result.map((q) => q.id);
      expect(new Set(ids).size).toBe(3);
    });

    it('should return questions in DOM order (chronological)', () => {
      const q1 = document.createElement('div');
      q1.setAttribute('data-message-author-role', 'user');
      q1.textContent = 'First question';
      document.body.appendChild(q1);

      const q2 = document.createElement('div');
      q2.setAttribute('data-message-author-role', 'user');
      q2.textContent = 'Second question';
      document.body.appendChild(q2);

      const result = extractQuestions();
      expect(result[0].fullText).toBe('First question');
      expect(result[1].fullText).toBe('Second question');
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(1);
    });
  });

  describe('formatDisplayText', () => {
    it('should return text as-is if under max length', () => {
      const text = 'Short text';
      const result = formatDisplayText(text, 80);
      expect(result).toBe('Short text');
    });

    it('should truncate text and add ellipsis if over max length', () => {
      const text = 'A'.repeat(100);
      const result = formatDisplayText(text, 80);
      expect(result).toBe('A'.repeat(80) + '...');
    });

    it('should handle exactly max length text', () => {
      const text = 'A'.repeat(80);
      const result = formatDisplayText(text, 80);
      expect(result).toBe('A'.repeat(80));
    });

    it('should replace newlines with spaces before truncating', () => {
      const text = 'Line 1\nLine 2';
      const result = formatDisplayText(text, 80);
      expect(result).toBe('Line 1 Line 2');
    });
  });
});
