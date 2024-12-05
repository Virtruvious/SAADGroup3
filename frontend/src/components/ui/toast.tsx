"use client"

import * as React from "react"
import { Transition } from "@headlessui/react"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  onClose: () => void
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

const ICONS = {
  success: (
    <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  info: (
    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
}

const BACKGROUND_CLASSES = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  type = "success",
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for the fade-out animation before calling onClose
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <Transition
      show={isVisible}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={cn(
            "rounded-lg shadow-lg p-6 max-w-md w-full border-2",
            BACKGROUND_CLASSES[type]
          )}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">{ICONS[type]}</div>
            <div className="flex-1 pt-0.5">
              <p className="text-base font-medium text-gray-900">{message}</p>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
