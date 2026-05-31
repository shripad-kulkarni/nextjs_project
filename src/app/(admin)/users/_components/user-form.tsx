"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, Loader2 } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { FileUploadField } from "./file-upload-field"

import { createUserAction, updateUserAction } from "@/actions/users"
import { GENDERS, BLOOD_GROUPS, MAX_PROFILE_PHOTO_SIZE, MAX_INTRO_VIDEO_SIZE } from "@/constants"
import type { UserDto } from "@/types/user"

// ─── Schemas ────────────────────────────────────────────────────────────────

const createSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "At least 10 digits").max(15),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.enum(GENDERS, { required_error: "Required" }),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pinCode: z.string().min(4, "At least 4 characters").max(10),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  description: z.string().max(500, "Max 500 characters").optional(),
})

const editSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  phone: z.string().min(10, "At least 10 digits").max(15),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pinCode: z.string().min(4, "At least 4 characters").max(10),
  description: z.string().max(500, "Max 500 characters").optional(),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

// ─── Helpers ────────────────────────────────────────────────────────────────

function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
        <ul className="space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-sm text-red-700">{e}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  user?: UserDto | null
}

export function UserForm({ user }: Props) {
  const isEdit = !!user
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<string[]>([])

  // File state — managed outside RHF since File objects don't serialize through Zod
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    user?.profilePhotoUrl ?? null,
  )
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(null)

  const [introVideo, setIntroVideo] = useState<File | null>(null)
  const [introVideoError, setIntroVideoError] = useState<string | null>(null)

  const [fileResetKey, setFileResetKey] = useState(0)

  const createForm = useForm<CreateFormData>({ resolver: zodResolver(createSchema) })
  const editForm   = useForm<EditFormData>({   resolver: zodResolver(editSchema)   })

  // Revoke object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (profilePhotoPreview && profilePhotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePhotoPreview)
      }
    }
  }, [profilePhotoPreview])

  useEffect(() => {
    if (user) {
      editForm.reset({
        firstName:   user.firstName,
        lastName:    user.lastName,
        phone:       user.phone,
        street:      user.street,
        city:        user.city,
        state:       user.state,
        pinCode:     user.pinCode,
        description: user.description ?? "",
      })
    }
  }, [user, editForm])

  const handlePhotoSelect = (file: File | null, error: string | null) => {
    setProfilePhotoError(error)
    setProfilePhoto(file)
    if (file) {
      if (profilePhotoPreview?.startsWith("blob:")) URL.revokeObjectURL(profilePhotoPreview)
      setProfilePhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleVideoSelect = (file: File | null, error: string | null) => {
    setIntroVideoError(error)
    setIntroVideo(file)
  }

  const buildFormData = (fields: Record<string, string | undefined>) => {
    const fd = new FormData()
    for (const [k, v] of Object.entries(fields)) {
      if (v != null) fd.append(k, v)
    }
    if (profilePhoto) fd.append("profilePhoto", profilePhoto, profilePhoto.name)
    if (introVideo)   fd.append("introVideo",   introVideo,   introVideo.name)
    return fd
  }

  const handleCreate = async (data: CreateFormData) => {
    if (profilePhotoError || introVideoError) return
    setServerErrors([])
    setIsLoading(true)
    try {
      const fd = buildFormData(data as Record<string, string | undefined>)
      const result = await createUserAction(fd)
      if (result.errors?.length) {
        setServerErrors(result.errors)
      } else if (result.error) {
        setServerErrors([result.error])
      } else {
        toast.success("User created.")
        router.push("/users")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (data: EditFormData) => {
    if (!user || profilePhotoError || introVideoError) return
    setServerErrors([])
    setIsLoading(true)
    try {
      const fd = buildFormData(data as Record<string, string | undefined>)
      fd.append("id", String(user.id))
      const result = await updateUserAction(fd)
      if (result.errors?.length) {
        setServerErrors(result.errors)
      } else if (result.error) {
        setServerErrors([result.error])
      } else {
        toast.success("User updated.")
        router.push("/users")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      {isEdit ? (
        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
          {/* Profile photo */}
          <FileUploadField
            displayMode="image-preview"
            label="Profile photo"
            accept="image/*"
            maxSizeBytes={MAX_PROFILE_PHOTO_SIZE}
            previewUrl={profilePhotoPreview}
            hint="JPG, PNG or WebP · max 5 MB"
            onFileSelect={handlePhotoSelect}
            error={profilePhotoError}
            resetKey={fileResetKey}
          />

          <Separator />

          <div className="bg-slate-50 rounded-md px-3 py-2 text-sm">
            <p className="text-xs text-muted-foreground mb-0.5">Email (read-only)</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={editForm.formState.errors.firstName?.message}>
              <Input {...editForm.register("firstName")} />
            </Field>
            <Field label="Last name" error={editForm.formState.errors.lastName?.message}>
              <Input {...editForm.register("lastName")} />
            </Field>
          </div>

          <Field label="Phone" error={editForm.formState.errors.phone?.message}>
            <Input {...editForm.register("phone")} placeholder="Phone number" />
          </Field>

          <Separator />

          <Field label="Street" error={editForm.formState.errors.street?.message}>
            <Input {...editForm.register("street")} placeholder="Street address" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" error={editForm.formState.errors.city?.message}>
              <Input {...editForm.register("city")} />
            </Field>
            <Field label="State" error={editForm.formState.errors.state?.message}>
              <Input {...editForm.register("state")} />
            </Field>
          </div>
          <Field label="Pin code" error={editForm.formState.errors.pinCode?.message}>
            <Input {...editForm.register("pinCode")} className="max-w-40" />
          </Field>

          <Separator />

          <Field label="Description (optional)" error={editForm.formState.errors.description?.message}>
            <Textarea
              {...editForm.register("description")}
              placeholder="Short bio or role description shown on the public team page"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {editForm.watch("description")?.length ?? 0} / 500
            </p>
          </Field>

          <Separator />

          {/* Intro video */}
          <FileUploadField
            displayMode="filename"
            label="Intro video"
            accept="video/*"
            maxSizeBytes={MAX_INTRO_VIDEO_SIZE}
            filename={introVideo?.name ?? null}
            hint={user.introVideoUrl ? "Replace existing video" : "MP4, MOV or WebM · max 100 MB"}
            onFileSelect={handleVideoSelect}
            error={introVideoError}
            resetKey={fileResetKey}
          />

          <ErrorList errors={serverErrors} />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          {/* Profile photo */}
          <FileUploadField
            displayMode="image-preview"
            label="Profile photo"
            accept="image/*"
            maxSizeBytes={MAX_PROFILE_PHOTO_SIZE}
            previewUrl={profilePhotoPreview}
            hint="JPG, PNG or WebP · max 5 MB"
            onFileSelect={handlePhotoSelect}
            error={profilePhotoError}
            resetKey={fileResetKey}
          />

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={createForm.formState.errors.firstName?.message}>
              <Input {...createForm.register("firstName")} />
            </Field>
            <Field label="Last name" error={createForm.formState.errors.lastName?.message}>
              <Input {...createForm.register("lastName")} />
            </Field>
          </div>

          <Field label="Email" error={createForm.formState.errors.email?.message}>
            <Input
              {...createForm.register("email")}
              type="email"
              placeholder="user@example.com"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" error={createForm.formState.errors.phoneNumber?.message}>
              <Input {...createForm.register("phoneNumber")} placeholder="Phone number" />
            </Field>
            <Field label="Date of birth" error={createForm.formState.errors.dateOfBirth?.message}>
              <Input {...createForm.register("dateOfBirth")} type="date" />
            </Field>
          </div>

          <Field label="Gender" error={createForm.formState.errors.gender?.message}>
            <Select onValueChange={(v) => createForm.setValue("gender", v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Separator />

          <Field label="Street" error={createForm.formState.errors.street?.message}>
            <Input {...createForm.register("street")} placeholder="Street address" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" error={createForm.formState.errors.city?.message}>
              <Input {...createForm.register("city")} />
            </Field>
            <Field label="State" error={createForm.formState.errors.state?.message}>
              <Input {...createForm.register("state")} />
            </Field>
          </div>
          <Field label="Pin code" error={createForm.formState.errors.pinCode?.message}>
            <Input {...createForm.register("pinCode")} className="max-w-40" />
          </Field>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Blood group (optional)">
              <Select onValueChange={(v) => createForm.setValue("bloodGroup", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Emergency contact (optional)">
              <Input
                {...createForm.register("emergencyContact")}
                placeholder="Phone number"
              />
            </Field>
          </div>

          <Separator />

          <Field label="Description (optional)" error={createForm.formState.errors.description?.message}>
            <Textarea
              {...createForm.register("description")}
              placeholder="Short bio or role description shown on the public team page"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {createForm.watch("description")?.length ?? 0} / 500
            </p>
          </Field>

          <Separator />

          {/* Intro video */}
          <FileUploadField
            displayMode="filename"
            label="Intro video"
            accept="video/*"
            maxSizeBytes={MAX_INTRO_VIDEO_SIZE}
            filename={introVideo?.name ?? null}
            hint="MP4, MOV or WebM · max 100 MB"
            onFileSelect={handleVideoSelect}
            error={introVideoError}
            resetKey={fileResetKey}
          />

          <ErrorList errors={serverErrors} />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create user
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
