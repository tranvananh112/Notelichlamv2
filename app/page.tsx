"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, BarChart3, LogIn, UserPlus } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)

      if (user) {
        router.push("/app")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 backdrop-blur-md bg-white/50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-900">Ghi Chú Công Việc</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              Đăng Nhập
            </Button>
            <Button onClick={() => router.push("/auth/sign-up")} className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Đăng Ký
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Quản Lý Công Việc Thông Minh</h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Ghi chú, theo dõi ngày làm việc, và tính toán lương tự động. Một giải pháp đơn giản để quản lý công việc hàng
          ngày của bạn.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 border border-slate-200/50 shadow-lg">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Lịch Làm Việc</h3>
            <p className="text-slate-600">Xem lịch sử công việc của bạn với giao diện lịch đẹp mắt và trực quan.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 border border-slate-200/50 shadow-lg">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ghi Chú Chi Tiết</h3>
            <p className="text-slate-600">Thêm ghi chú, điểm danh, và theo dõi tiến độ công việc của bạn.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 border border-slate-200/50 shadow-lg">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Thống Kê Lương</h3>
            <p className="text-slate-600">Tính toán tự động khi đủ 30 ngày làm việc và theo dõi lịch sử thanh toán.</p>
          </div>
        </div>

        <Button
          onClick={() => router.push("/auth/sign-up")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-lg"
        >
          Bắt Đầu Ngay
        </Button>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-md border-t border-slate-200/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Tính Năng Chính</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Quản Lý Lịch Làm Việc</h3>
                <p className="text-slate-600">Ghi lại ngày làm việc, điểm danh, và xem lịch sử công việc chi tiết.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Ghi Chú Có Màu</h3>
                <p className="text-slate-600">
                  Tạo ghi chú với 6 màu khác nhau và theo dõi tiến độ công việc (0-100%).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <BarChart3 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tính Lương Tự Động</h3>
                <p className="text-slate-600">Hệ thống tự động thông báo khi đủ 30 ngày làm việc để nhận lương.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Đăng Nhập Đa Thiết Bị</h3>
                <p className="text-slate-600">Đăng nhập từ bất kỳ thiết bị nào và dữ liệu của bạn luôn được đồng bộ.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-8 text-center text-slate-600">
        <div className="container mx-auto px-4">
          <p>&copy; 2026 Ghi Chú Công Việc. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </main>
  )
}
