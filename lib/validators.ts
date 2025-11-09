export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateFormData(
  data: Record<string, any>,
  schema: Record<string, any>,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  for (const [field, validation] of Object.entries(schema)) {
    const value = data[field]

    if (validation.required && !value) {
      errors[field] = `${field} is required`
    }

    if (validation.email && value && !validateEmail(value)) {
      errors[field] = "Invalid email format"
    }

    if (validation.min && value && value.length < validation.min) {
      errors[field] = `${field} must be at least ${validation.min} characters`
    }

    if (validation.max && value && value.length > validation.max) {
      errors[field] = `${field} must be no more than ${validation.max} characters`
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
