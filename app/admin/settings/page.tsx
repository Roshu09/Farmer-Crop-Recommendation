"use client"

import type React from "react"

import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Save } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "CropRecommend",
    apiUrl: "http://localhost:5000",
    weatherApiKey: "",
    enableNotifications: true,
    maintenanceMode: false,
    maxUploadSize: 50,
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
    setSaved(false)
  }

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save settings", err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and integrations</p>
        </div>

        {saved && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Settings saved successfully!</p>
          </div>
        )}

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <Input name="platformName" value={settings.platformName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API URL</label>
              <Input name="apiUrl" value={settings.apiUrl} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Upload Size (MB)</label>
              <Input type="number" name="maxUploadSize" value={settings.maxUploadSize} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* API Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>API Integrations</CardTitle>
            <CardDescription>External service configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenWeatherMap API Key</label>
              <Input
                type="password"
                name="weatherApiKey"
                placeholder="Enter your API key"
                value={settings.weatherApiKey}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Get your key from openweathermap.org</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <label className="font-medium cursor-pointer">Enable Notifications</label>
              <input
                type="checkbox"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <label className="font-medium cursor-pointer">Maintenance Mode</label>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </AdminLayout>
  )
}
