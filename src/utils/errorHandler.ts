const LOG_PREFIX = '[ChatGPT Navigator]';

/**
 * Logs an error with extension context
 * @param context - Description of where the error occurred
 * @param error - The error object
 */
export function logError(context: string, error: unknown): void {
  console.error(`${LOG_PREFIX} Error in ${context}:`, error);
}

/**
 * Logs a warning with extension context
 * @param context - Description of the warning
 * @param message - Warning message
 */
export function logWarning(context: string, message: string): void {
  console.warn(`${LOG_PREFIX} Warning in ${context}: ${message}`);
}

/**
 * Logs an info message with extension context
 * @param message - Info message
 */
export function logInfo(message: string): void {
  console.info(`${LOG_PREFIX} ${message}`);
}

/**
 * Wraps function execution with error boundary
 * Logs errors to console but never throws
 *
 * @param fn - Function to execute safely
 * @param fallback - Fallback value to return on error
 * @param context - Description of the operation
 * @returns The function result or fallback on error
 */
export function safeExecute<T>(fn: () => T, fallback: T, context: string): T {
  try {
    return fn();
  } catch (error) {
    logError(context, error);
    return fallback;
  }
}

/**
 * Wraps async function execution with error boundary
 * Logs errors to console but never throws
 *
 * @param fn - Async function to execute safely
 * @param fallback - Fallback value to return on error
 * @param context - Description of the operation
 * @returns The function result or fallback on error
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(context, error);
    return fallback;
  }
}
