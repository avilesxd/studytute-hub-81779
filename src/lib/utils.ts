import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The function `cn` in TypeScript merges multiple class values using `clsx` and `twMerge`.
 * @param {ClassValue[]} inputs - The `inputs` parameter in the `cn` function is a rest parameter that allows you to pass in multiple arguments
 * of type `ClassValue`. These arguments can be strings, arrays, or objects representing CSS classes. The function then merges these class
 * values using the `clsx` function and returns the
 * @returns The `cn` function is returning the result of merging the class names passed as arguments using the `clsx` function and then
 * applying Tailwind CSS utility classes using the `twMerge` function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
