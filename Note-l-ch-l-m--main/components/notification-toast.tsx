"use client"
import { CheckCircle, AlertCircle, X } from "lucide-react"

export interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
  duration?: number
}

interface NotificationToastProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function NotificationToast({ toasts, onRemove }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-in slide-in-from-top-2 fade-in">
          <div
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border ${
              toast.type === "success"
                ? "bg-success/10 border-success text-success"
                : toast.type === "error"
                  ? "bg-destructive/10 border-destructive text-destructive"
                  : "bg-primary/10 border-primary text-primary"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
              {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
