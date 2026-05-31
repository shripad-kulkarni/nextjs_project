"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { updateInfoSettingsAction, uploadLogoAction } from "@/actions/settings"
import type { InfoSettings } from "@/lib/api/settings"

const schema = z.object({
  name:  z.string().min(1, "Name is required").max(200),
  address:     z.string().max(500).optional(),
  phoneNumber: z.string().max(30).optional(),
  email:       z.string().email("Invalid email").optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

export function InfoSettingsForm({ settings }: { settings: InfoSettings }) {
  const [isSaving, setIsSaving]   = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoPath ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:  settings.name,
      address:     settings.address     ?? "",
      phoneNumber: settings.phoneNumber ?? "",
      email:       settings.email       ?? "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    const fd = new FormData()
    fd.append("name",  data.name)
    if (data.address)     fd.append("address",     data.address)
    if (data.phoneNumber) fd.append("phoneNumber", data.phoneNumber)
    if (data.email)       fd.append("email",       data.email)

    const result = await updateInfoSettingsAction(fd)
    setIsSaving(false)

    if (result.error) toast.error(result.error)
    else toast.success("Settings saved.")
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoPreview(URL.createObjectURL(file))
    setIsUploading(true)

    const fd = new FormData()
    fd.append("file", file, file.name)
    const result = await uploadLogoAction(fd)
    setIsUploading(false)

    if (result.error) {
      toast.error(result.error)
      setLogoPreview(settings.logoPath ?? null)
    } else {
      toast.success("Logo uploaded.")
    }
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Logo</h2>
          <p className="text-sm text-muted-foreground mt-0.5">JPG, PNG or WebP recommended</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-xl border bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-slate-300">
                {settings.name[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileRef.current?.click()}
            >
              {isUploading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
                : <><Upload className="mr-2 h-4 w-4" />Upload logo</>}
            </Button>
            {logoPreview && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => setLogoPreview(null)}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* General info */}
      <div className="rounded-xl border bg-white p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">General Information</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Shown across the public website</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Organisation name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              {...register("name")}
              className={errors.name ? "border-red-400" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} placeholder="123 Main Street, City" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@example.com"
                className={errors.email ? "border-red-400" : ""}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
