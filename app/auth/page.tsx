// app/auth/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function Page() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Burada giriş işlemleri yapılacak
    setTimeout(() => setLoading(false), 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Burada kayıt işlemleri yapılacak
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Tabs defaultValue="login" className="w-full">
            {/* Tabs içeriği aynı kalacak */}
            {/* ... */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
