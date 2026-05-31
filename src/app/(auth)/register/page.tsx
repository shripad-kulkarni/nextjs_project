"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { registerAction, loginAction } from "@/actions/auth"
import { ROLES } from "@/constants"

const registerSchema = z
  .object({
    firstName: z.string().min(2, "At least 2 characters"),
    lastName: z.string().min(2, "At least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(ROLES, { required_error: "Please select a role" }),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const regResult = await registerAction({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })

      if (regResult.error) {
        toast.error(regResult.error)
        return
      }

      const loginResult = await loginAction({ email: data.email, password: data.password })
      if (loginResult.error) {
        toast.success("Account created! Please sign in.")
        router.push("/login")
      } else {
        toast.success("Account created successfully!")
        router.push("/dashboard")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-muted-foreground mt-1 text-sm">Fill in the details below to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              {...register("firstName")}
              className={errors.firstName ? "border-red-400" : ""}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              {...register("lastName")}
              className={errors.lastName ? "border-red-400" : ""}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className={errors.email ? "border-red-400" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setValue("role", value as any)}>
            <SelectTrigger id="role" className={errors.role ? "border-red-400" : ""}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, uppercase, number, symbol"
              autoComplete="new-password"
              {...register("password")}
              className={errors.password ? "border-red-400 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-400 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full h-10 mt-2" disabled={isLoading}>
          {isLoading
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</>
            : "Create account"}
        </Button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/login">
          <Button variant="outline" className="w-full h-10">Sign in</Button>
        </Link>
      </div>
    </div>
  )
}
