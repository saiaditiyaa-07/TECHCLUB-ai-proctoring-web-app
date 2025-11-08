"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Users, BookOpen } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">ExamGuard</h1>
          </div>
          <p className="text-slate-400">AI-Powered Exam Proctoring</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-pretty">Secure Online Exam Platform</h2>
          <p className="text-xl text-slate-300 mb-8">
            Advanced AI proctoring with real-time monitoring, violation detection, and comprehensive analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 p-8 hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">For Students</h3>
                <p className="text-slate-300 mb-6">Take secure, proctored exams with real-time monitoring</p>
                <Link href="/auth/login">
                  <Button className="bg-blue-600 hover:bg-blue-700">Student Login</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-8 hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <BookOpen className="w-8 h-8 text-emerald-500 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">For Administrators</h3>
                <p className="text-slate-300 mb-6">Create tests, assign exams, and monitor proctoring</p>
                <Link href="/auth/login?role=admin">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Admin Login</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Key Features</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-slate-300">
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Real-time face recognition & identity verification</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Multi-face detection & mobile phone detection</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Browser activity monitoring & tab switching detection</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Audio monitoring & eye movement tracking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Automatic test termination after 3 violations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Comprehensive analytics & violation reports</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
