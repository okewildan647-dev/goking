export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function hasFieldErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}
