"use client"

import * as React from "react"
import { Transition } from "@headlessui/react"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
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
        <div className={cn(
          "bg-white rounded-lg shadow-lg",
          "border-2 border-gray-200",
          "p-6 max-w-md w-full"
        )}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
