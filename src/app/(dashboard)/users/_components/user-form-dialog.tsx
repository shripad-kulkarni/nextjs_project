"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { createUserAction, updateUserAction } from "@/actions/users"
import { GENDERS, BLOOD_GROUPS } from "@/types/user"
import type { UserDto } from "@/types/user"

// ─── Schemas ────────────────────────────────────────────────────────────────

const createSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "At least 10 digits").max(15),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Required" }),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pinCode: z.string().min(4, "At least 4 characters").max(10),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
})

const editSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  phone: z.string().min(10, "At least 10 digits").max(15),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pinCode: z.string().min(4, "At least 4 characters").max(10),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

// ─── Helper ─────────────────────────────────────────────────────────────────

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
  open: boolean
  onOpenChange: (v: boolean) => void
  user?: UserDto | null
}

export function UserFormDialog({ open, onOpenChange, user }: Props) {
  const isEdit = !!user
  const [isLoading, setIsLoading] = useState(false)

  const createForm = useForm<CreateFormData>({ resolver: zodResolver(createSchema) })
  const editForm = useForm<EditFormData>({ resolver: zodResolver(editSchema) })

  const { reset: resetCreate } = createForm
  const { reset: resetEdit } = editForm

  useEffect(() => {
    if (!open) return
    if (user) {
      resetEdit({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
      })
    } else {
      resetCreate()
    }
  }, [open, user, resetCreate, resetEdit])

  const handleCreate = async (data: CreateFormData) => {
    setIsLoading(true)
    try {
      const result = await createUserAction(data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User created.")
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (data: EditFormData) => {
    if (!user) return
    setIsLoading(true)
    try {
      const result = await updateUserAction(user.id, data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User updated.")
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-3">
          {isEdit ? (
            <form
              id="user-form"
              onSubmit={editForm.handleSubmit(handleEdit)}
              className="space-y-4 py-1"
            >
              <div className="bg-slate-50 rounded-md px-3 py-2 text-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Email (read-only)</p>
                <p className="font-medium">{user?.email}</p>
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
            </form>
          ) : (
            <form
              id="user-form"
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4 py-1"
            >
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
            </form>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="user-form" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
