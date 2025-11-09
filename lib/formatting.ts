export function formatPrice(price: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function getPercentageColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600"
  if (percentage >= 60) return "text-blue-600"
  if (percentage >= 40) return "text-amber-600"
  return "text-red-600"
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700"
    case "inactive":
      return "bg-gray-50 text-gray-700"
    case "pending":
      return "bg-amber-50 text-amber-700"
    case "error":
      return "bg-red-50 text-red-700"
    default:
      return "bg-muted text-foreground"
  }
}
