"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { verifyEmailAction } from "@/actions/auth"

type Status = "loading" | "success" | "error"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const token = searchParams.get("token") ?? ""

  const [status, setStatus] = useState<Status>("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!email || !token) {
      setStatus("error")
      setErrorMessage("Invalid verification link.")
      return
    }

    verifyEmailAction(email, token).then((result) => {
      if (result.error) {
        setErrorMessage(result.error)
        setStatus("error")
      } else {
        setStatus("success")
      }
    })
  }, [email, token])

  if (status === "loading") {
    return (
      <div className="text-center space-y-4 py-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Email verified!</h2>
        <p className="text-sm text-muted-foreground">
          Your account is now active. You can sign in.
        </p>
        <Link href="/login">
          <Button className="w-full h-10 mt-2">Sign in</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
        <XCircle className="w-6 h-6 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Verification failed</h2>
      <p className="text-sm text-muted-foreground">{errorMessage}</p>
      <Link href="/forgot-password">
        <Button variant="outline" className="w-full h-10 mt-2">Request a new link</Button>
      </Link>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center space-y-4 py-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
