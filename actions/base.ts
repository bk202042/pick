'use server';

import { z } from 'zod';

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Validates data using a Zod schema and handles errors
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validated data or throws an error
 */
export async function validateData<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; fieldErrors: Record<string, string[]> }> {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.errors.forEach((err) => {
        const field = err.path.join('.') || 'form';
        fieldErrors[field] = fieldErrors[field] || [];
        fieldErrors[field].push(err.message);
      });

      return { success: false, fieldErrors };
    }

    throw error;
  }
}

/**
 * Wraps an action function to handle errors consistently
 * @param fn The action function to wrap
 * @returns A wrapped function that returns an ActionResult
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<ActionResult<T>> {
  return async (...args: Args) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      console.error('Action error:', error);

      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          const field = err.path.join('.') || 'form';
          fieldErrors[field] = fieldErrors[field] || [];
          fieldErrors[field].push(err.message);
        });

        return { success: false, error: 'Validation failed', fieldErrors };
      }

      if (error instanceof Error) {
        return { success: false, error: error.message };
      }

      return { success: false, error: 'An unexpected error occurred' };
    }
  };
}
