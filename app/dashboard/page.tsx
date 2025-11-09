"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Droplets, Wind, Sun, AlertCircle, Loader, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const INDIAN_STATES = {
  "Uttar Pradesh": ["Kanpur", "Lucknow", "Agra", "Varanasi", "Meerut"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Udaipur", "Ajmer"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
}

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  rainfall: number
  uv?: number
  cloudCover?: number
}

interface SoilData {
  nitrogen: number
  phosphorus: number
  potassium: number
  pH: number
}

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [soil, setSoil] = useState<SoilData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [weatherLocation, setWeatherLocation] = useState<string>("")

  const [showFarmDialog, setShowFarmDialog] = useState(false)
  const [farmData, setFarmData] = useState({
    name: "",
    size: "",
    soilType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      fetchWeatherForLocation(selectedDistrict)
    }
  }, [selectedDistrict])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/farmer/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch data")
      }

      const data = await response.json()

      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.location?.district) {
        await fetchWeatherForLocation(user.location.district)
        setWeatherLocation(user.location.district)
      } else {
        setWeather(
          data.dashboard?.weather || {
            temperature: 25,
            humidity: 65,
            windSpeed: 10,
            condition: "Clear",
            rainfall: 0,
          },
        )
      }

      setSoil(
        data.dashboard?.soilData || {
          nitrogen: 150,
          phosphorus: 60,
          potassium: 200,
          pH: 7,
        },
      )
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherForLocation = async (city: string) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/weather/location?city=${city}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setWeather(data.weather)
        setWeatherLocation(city)
      }
    } catch (err) {
      console.error("Failed to fetch weather for location:", err)
    }
  }

  const handleCreateFarm = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/farmer/farm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: farmData.name,
          size: Number(farmData.size),
          soilType: farmData.soilType,
          soilData: {
            nitrogen: Number(farmData.nitrogen),
            phosphorus: Number(farmData.phosphorus),
            potassium: Number(farmData.potassium),
            ph: Number(farmData.ph),
          },
        }),
      })

      if (response.ok) {
        setShowFarmDialog(false)
        fetchDashboardData()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create farm")
      }
    } catch (err) {
      console.error("Failed to create farm:", err)
      alert("Failed to create farm")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your farm management hub</p>
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setSelectedState(value)
                setSelectedDistrict("")
              }}
            >
              <SelectTrigger className="w-[180px]">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(INDIAN_STATES).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedState && (
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES[selectedState as keyof typeof INDIAN_STATES]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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
          <>
            {/* Weather Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Current Conditions {weatherLocation && `- ${weatherLocation}`}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {weather &&
                  [
                    {
                      icon: Cloud,
                      label: "Condition",
                      value: weather.condition,
                      unit: "",
                    },
                    {
                      icon: Sun,
                      label: "Temperature",
                      value: weather.temperature,
                      unit: "°C",
                    },
                    {
                      icon: Droplets,
                      label: "Humidity",
                      value: weather.humidity,
                      unit: "%",
                    },
                    {
                      icon: Wind,
                      label: "Wind Speed",
                      value: weather.windSpeed,
                      unit: "km/h",
                    },
                  ].map((item) => (
                    <Card key={item.label} className="bg-background hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                            <p className="text-2xl font-bold text-foreground">
                              {item.value}
                              {item.unit}
                            </p>
                          </div>
                          <item.icon className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Soil Analysis */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Soil Analysis</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {soil &&
                  [
                    {
                      label: "Nitrogen (N)",
                      value: soil.nitrogen,
                      unit: "mg/kg",
                      status: soil.nitrogen > 100 ? "good" : "low",
                    },
                    {
                      label: "Phosphorus (P)",
                      value: soil.phosphorus,
                      unit: "mg/kg",
                      status: soil.phosphorus > 50 ? "good" : "low",
                    },
                    {
                      label: "Potassium (K)",
                      value: soil.potassium,
                      unit: "mg/kg",
                      status: soil.potassium > 150 ? "good" : "low",
                    },
                    {
                      label: "pH Level",
                      value: soil.pH.toFixed(1),
                      unit: "",
                      status: soil.pH >= 6 && soil.pH <= 7.5 ? "good" : "warning",
                    },
                  ].map((item) => (
                    <Card
                      key={item.label}
                      className={`${
                        item.status === "good"
                          ? "border-green-200 bg-green-50"
                          : item.status === "low"
                            ? "border-amber-200 bg-amber-50"
                            : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <CardContent className="p-6">
                        <p className="text-sm font-medium mb-2">{item.label}</p>
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.unit}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-foreground">Get Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      View AI-powered crop suggestions based on your current conditions
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Recommendations
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-foreground">Market Prices</h3>
                    <p className="text-sm text-muted-foreground">
                      Check current market prices for crops in your region
                    </p>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Check Prices</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-foreground">Create Farm Profile</h3>
                    <p className="text-sm text-muted-foreground">Add your farm details and soil test results</p>
                    <Dialog open={showFarmDialog} onOpenChange={setShowFarmDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                          Create Farm
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Farm Profile</DialogTitle>
                          <DialogDescription>
                            Add your farm details and soil test results to get personalized recommendations
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="farmName">Farm Name</Label>
                            <Input
                              id="farmName"
                              placeholder="My Farm"
                              value={farmData.name}
                              onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="size">Farm Size (acres)</Label>
                              <Input
                                id="size"
                                type="number"
                                placeholder="10"
                                value={farmData.size}
                                onChange={(e) => setFarmData({ ...farmData, size: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="soilType">Soil Type</Label>
                              <Select
                                value={farmData.soilType}
                                onValueChange={(value) => setFarmData({ ...farmData, soilType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="loamy">Loamy</SelectItem>
                                  <SelectItem value="clay">Clay</SelectItem>
                                  <SelectItem value="sandy">Sandy</SelectItem>
                                  <SelectItem value="silty">Silty</SelectItem>
                                  <SelectItem value="peaty">Peaty</SelectItem>
                                  <SelectItem value="chalky">Chalky</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold">Soil Test Results</h4>
                            <p className="text-sm text-muted-foreground">Enter your soil analysis values</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nitrogen">Nitrogen (mg/kg)</Label>
                              <Input
                                id="nitrogen"
                                type="number"
                                placeholder="150"
                                value={farmData.nitrogen}
                                onChange={(e) => setFarmData({ ...farmData, nitrogen: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phosphorus">Phosphorus (mg/kg)</Label>
                              <Input
                                id="phosphorus"
                                type="number"
                                placeholder="60"
                                value={farmData.phosphorus}
                                onChange={(e) => setFarmData({ ...farmData, phosphorus: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="potassium">Potassium (mg/kg)</Label>
                              <Input
                                id="potassium"
                                type="number"
                                placeholder="200"
                                value={farmData.potassium}
                                onChange={(e) => setFarmData({ ...farmData, potassium: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="ph">pH Level</Label>
                              <Input
                                id="ph"
                                type="number"
                                step="0.1"
                                placeholder="7.0"
                                value={farmData.ph}
                                onChange={(e) => setFarmData({ ...farmData, ph: e.target.value })}
                              />
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleCreateFarm}
                            disabled={!farmData.name || !farmData.size || !farmData.soilType}
                          >
                            Create Farm Profile
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
