"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { deleteUserAction } from "@/actions/users"
import type { UserDto } from "@/types/user"

interface Props {
  user: UserDto | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function DeleteDialog({ user, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const result = await deleteUserAction(user.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User deleted.")
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{user?.fullName}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
