"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ArrowLeft, Plus, Trash2, Eye, EyeOff } from "lucide-react"

export default function AdminDashboard({
  onBack,
  currentUserEmail,
}: {
  onBack: () => void
  currentUserEmail: string
}) {
  const supabase = createClient()
  const [users, setUsers] = useState<Array<{ id: string; email: string; is_admin: boolean; created_at: string }>>([])
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (data) {
      setUsers(data)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!newUserEmail || !newUserPassword) {
      setError("Vui lòng điền đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
      })

      if (authError) throw authError

      // User profile will be auto-created by trigger
      setNewUserEmail("")
      setNewUserPassword("")
      await loadUsers()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Lỗi tạo tài khoản")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail === currentUserEmail) {
      setError("Không thể xóa tài khoản của chính mình")
      return
    }

    if (confirm(`Xác nhận xóa tài khoản ${userEmail}?`)) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId)
        if (error) throw error
        await loadUsers()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Lỗi xóa tài khoản")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="outline" onClick={onBack} className="mb-6 gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Quay Lại
        </Button>

        <div className="grid gap-6">
          {/* Create User Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tạo Tài Khoản Mới</CardTitle>
              <CardDescription>Thêm người dùng mới vào hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mật Khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={isLoading} className="gap-2 w-full">
                  <Plus className="w-4 h-4" />
                  {isLoading ? "Đang Tạo..." : "Tạo Tài Khoản"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Người Dùng</CardTitle>
              <CardDescription>Quản lí tất cả tài khoản trong hệ thống ({users.length})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Vai Trò</th>
                      <th className="pb-3 font-semibold">Tạo Lúc</th>
                      <th className="pb-3 font-semibold">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.is_admin
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            }`}
                          >
                            {user.is_admin ? "Quản Trị" : "Người Dùng"}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(user.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3">
                          {user.email !== currentUserEmail && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
