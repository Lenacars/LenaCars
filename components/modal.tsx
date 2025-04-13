"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import HubspotForm from "./hubspot-form"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function Modal({ isOpen, onClose, title }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Modal açıkken scroll'u engelle
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isMounted) return null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-[#6A3C96]">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <HubspotForm />
        </div>
      </div>
    </div>
  )
}
