/**
 * Input validation utilities using Zod
 */

import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Password validation
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// PIN validation (4 digits)
export const pinSchema = z
  .string()
  .length(4, 'PIN must be exactly 4 digits')
  .regex(/^\d{4}$/, 'PIN must contain only numbers');

// Age validation (for children)
export const ageSchema = z
  .number()
  .min(3, 'Age must be at least 3')
  .max(17, 'Age must be 17 or younger');

// Child profile validation
export const childProfileSchema = z.object({
  name: nameSchema,
  avatar: z.string().min(1, 'Please select an avatar'),
  pin: pinSchema,
  age: ageSchema,
});

// Signup form validation
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Validation result type
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

/**
 * Validate data against a Zod schema
 * Returns either the validated data or a map of field errors
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return { success: false, errors };
}

/**
 * Validate a single field
 */
export function validateField(
  schema: z.ZodSchema,
  value: unknown
): string | null {
  const result = schema.safeParse(value);
  if (result.success) {
    return null;
  }
  return result.error.issues[0]?.message || 'Invalid value';
}
