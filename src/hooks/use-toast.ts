"use client"

import { useState, useCallback } from "react"

export type ToastVariant = "default" | "destructive"

export interface ToastProps {
  id?: number
  title: string
  description: string
  duration?: number
  variant?: ToastVariant
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, duration = 3000, variant = "default" }: ToastProps) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration, variant }])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  return { toast, toasts }
}

