import { customAlphabet } from 'nanoid/non-secure';

// URL-safe, 21-char IDs — faster than crypto nanoid for non-sensitive IDs
const generate = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21);

export function generateId(): string {
  return generate();
}
