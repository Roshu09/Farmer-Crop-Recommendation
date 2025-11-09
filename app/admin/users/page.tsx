"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader, Search, Mail, MapPin, Trash2, Eye } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  state: string
  district: string
  joinDate: string
  status: "active" | "inactive"
  farmSize: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch users")

      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError("Failed to load users")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
      }
    } catch (err) {
      console.error("Failed to delete user", err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage platform users and farmers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Add New User</Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
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
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Complete list of registered farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-foreground">Name</th>
                      <th className="text-left p-3 font-semibold text-foreground">Email</th>
                      <th className="text-left p-3 font-semibold text-foreground">Location</th>
                      <th className="text-left p-3 font-semibold text-foreground">Farm Size</th>
                      <th className="text-left p-3 font-semibold text-foreground">Status</th>
                      <th className="text-left p-3 font-semibold text-foreground">Joined</th>
                      <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {user.district}, {user.state}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-foreground">{user.farmSize} ha</p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              user.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground">{user.joinDate}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive bg-transparent"
                              onClick={() => handleDeleteUser(user.id)}
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
