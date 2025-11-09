"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader, Search, Edit2, Trash2, Plus } from "lucide-react"

interface Crop {
  id: string
  name: string
  season: string
  ph_min: number
  ph_max: number
  moisture_min: number
  moisture_max: number
  avg_yield: number
  market_demand: "high" | "medium" | "low"
}

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/crops`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch crops")

      const data = await response.json()
      setCrops(data.crops || [])
    } catch (err) {
      setError("Failed to load crops data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCrops = crops.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteCrop = async (cropId: string) => {
    if (!confirm("Are you sure you want to delete this crop?")) return

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/crops/${cropId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        setCrops(crops.filter((c) => c.id !== cropId))
      }
    } catch (err) {
      console.error("Failed to delete crop", err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crop Management</h1>
            <p className="text-muted-foreground">Manage crop database and parameters</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Crop
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search crops by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Crops ({filteredCrops.length})</CardTitle>
              <CardDescription>Complete list of supported crops with parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-foreground">Crop Name</th>
                      <th className="text-left p-3 font-semibold text-foreground">Season</th>
                      <th className="text-left p-3 font-semibold text-foreground">pH Range</th>
                      <th className="text-left p-3 font-semibold text-foreground">Moisture</th>
                      <th className="text-left p-3 font-semibold text-foreground">Avg Yield</th>
                      <th className="text-left p-3 font-semibold text-foreground">Market Demand</th>
                      <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrops.map((crop) => (
                      <tr key={crop.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-foreground">{crop.name}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground">{crop.season}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-foreground">
                            {crop.ph_min.toFixed(1)} - {crop.ph_max.toFixed(1)}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-foreground">
                            {crop.moisture_min}% - {crop.moisture_max}%
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm font-medium text-primary">{crop.avg_yield} tonnes/ha</p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              crop.market_demand === "high"
                                ? "bg-green-50 text-green-700"
                                : crop.market_demand === "medium"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {crop.market_demand}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive bg-transparent"
                              onClick={() => handleDeleteCrop(crop.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
