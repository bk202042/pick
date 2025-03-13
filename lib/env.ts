import { z } from 'zod';

/**
 * Validates environment variables using Zod
 * Ensures all required environment variables are present and properly formatted
 */
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
});

/**
 * Parses environment variables using the Zod schema
 * @returns The validated environment variables
 * @throws Error if any required variables are missing or malformed
 */
export function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.'));
      throw new Error(`❌ Missing or invalid environment variables: ${missingVars.join(', ')}`);
    }
    throw new Error('❌ Failed to validate environment variables');
  }
}

/**
 * Validates environment variables when imported
 * This function is called immediately to ensure environment variables are valid
 */
export function validateEnv() {
  try {
    getEnv();
    return true;
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Unknown error validating environment variables'
    );
    return false;
  }
}

// Validate on import
validateEnv();
