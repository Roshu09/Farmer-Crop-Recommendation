import { ApiClient } from "./api-client"

export interface AuthTokens {
  token: string
  userRole: "farmer" | "admin"
}

export async function login(email: string, password: string): Promise<AuthTokens | null> {
  const response = await ApiClient.login(email, password)

  if (response.success && response.data) {
    const tokens: AuthTokens = {
      token: response.data.token,
      userRole: response.data.userRole,
    }

    // Store tokens
    localStorage.setItem("token", tokens.token)
    localStorage.setItem("userRole", tokens.userRole)

    // Set API client token
    ApiClient.setToken(tokens.token)

    return tokens
  }

  return null
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("userRole")
  ApiClient.clearToken()
}

export function getStoredToken(): string | null {
  return localStorage.getItem("token")
}

export function getStoredRole(): "farmer" | "admin" | null {
  const role = localStorage.getItem("userRole")
  return role as "farmer" | "admin" | null
}

export function initializeAuth() {
  const token = getStoredToken()
  if (token) {
    ApiClient.setToken(token)
  }
}
