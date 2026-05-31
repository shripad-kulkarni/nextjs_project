"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { submitContactAction } from "@/actions/contact"

const schema = z.object({
  name:    z.string().min(2, "At least 2 characters"),
  email:   z.string().email("Invalid email"),
  phone:   z.string().min(7, "At least 7 digits").optional().or(z.literal("")),
  subject: z.string().min(2, "At least 2 characters"),
  message: z.string().min(10, "At least 10 characters").max(2000, "Max 2000 characters"),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await submitContactAction({
      name:    data.name,
      email:   data.email,
      phone:   data.phone || undefined,
      subject: data.subject,
      message: data.message,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Message sent!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)} className="mt-2">
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className={errors.name ? "border-red-400" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Your email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={errors.email ? "border-red-400" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone number <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          {...register("phone")}
          className={errors.phone ? "border-red-400" : ""}
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="How can we help?"
          {...register("subject")}
          className={errors.subject ? "border-red-400" : ""}
        />
        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Write your message here…"
          rows={5}
          {...register("message")}
          className={errors.message ? "border-red-400" : ""}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</>
          : <><Send className="mr-2 h-4 w-4" />Send message</>}
      </Button>
    </form>
  )
}
