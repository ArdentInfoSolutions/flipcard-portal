"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/profile")
    }
  }, [session, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
        <p className="text-gray-600 mb-4">Sign in to continue</p>

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

