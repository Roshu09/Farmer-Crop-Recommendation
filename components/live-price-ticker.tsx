"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PriceData {
  crop: string
  price: number
  change: number
}

export function LivePriceTicker() {
  const [prices, setPrices] = useState<PriceData[]>([
    { crop: "Rice", price: 28, change: 0 },
    { crop: "Wheat", price: 22, change: 0 },
    { crop: "Cotton", price: 45, change: 0 },
    { crop: "Sugarcane", price: 35, change: 0 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => {
          const change = (Math.random() - 0.5) * 2
          const newPrice = Math.max(p.price + change, p.price * 0.9)
          return {
            ...p,
            price: Number(newPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex gap-6 animate-scroll">
        {prices.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-semibold text-foreground">{item.crop}:</span>
            <span className="text-foreground">₹{item.price}/kg</span>
            <span className={`text-xs flex items-center gap-1 ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.change >= 0 ? "+" : ""}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
