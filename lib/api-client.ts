const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export class ApiClient {
  private static token: string | null = null

  static setToken(token: string) {
    this.token = token
  }

  static clearToken() {
    this.token = null
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Request failed",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  // Auth endpoints
  static async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  static async signup(data: any) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Dashboard endpoints
  static async getDashboard() {
    return this.request("/api/dashboard")
  }

  static async getRecommendations() {
    return this.request("/api/recommendations")
  }

  static async getMarketPrices() {
    return this.request("/api/market-prices")
  }

  static async getAnalytics(timeRange: string) {
    return this.request(`/api/analytics?timeRange=${timeRange}`)
  }

  static async getMarketAnalysis() {
    return this.request("/api/market-analysis")
  }

  // Admin endpoints
  static async getAdminStats() {
    return this.request("/api/admin/stats")
  }

  static async getUsers() {
    return this.request("/api/admin/users")
  }

  static async deleteUser(userId: string) {
    return this.request(`/api/admin/users/${userId}`, {
      method: "DELETE",
    })
  }

  static async getSettings() {
    return this.request("/api/admin/settings")
  }

  static async updateSettings(settings: any) {
    return this.request("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    })
  }
}
