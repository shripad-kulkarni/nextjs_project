"use client"

import { useRef } from "react"
import { Camera, Video, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BaseProps {
  label: string
  accept: string
  maxSizeBytes: number
  onFileSelect: (file: File | null, error: string | null) => void
  error?: string | null
  resetKey?: number
}

interface ImagePreviewProps extends BaseProps {
  displayMode: "image-preview"
  previewUrl?: string | null
  hint?: string
}

interface FilenameProps extends BaseProps {
  displayMode: "filename"
  filename?: string | null
  hint?: string
}

type Props = ImagePreviewProps | FilenameProps

export function FileUploadField(props: Props) {
  const { label, accept, maxSizeBytes, onFileSelect, error, resetKey } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) { onFileSelect(null, null); return }

    const expectedType = accept.replace("/*", "/")
    if (!file.type.startsWith(expectedType)) {
      onFileSelect(null, `Please select a valid ${label.toLowerCase()} file.`)
      e.target.value = ""
      return
    }
    if (file.size > maxSizeBytes) {
      const mb = Math.round(maxSizeBytes / 1024 / 1024)
      onFileSelect(null, `File is too large. Maximum size is ${mb} MB.`)
      e.target.value = ""
      return
    }
    onFileSelect(file, null)
  }

  if (props.displayMode === "image-preview") {
    const { previewUrl, hint } = props
    return (
      <div className="space-y-1.5">
        <p className="text-sm font-medium leading-none">{label}</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative h-20 w-20 rounded-full border-2 border-dashed border-input bg-muted",
              "flex items-center justify-center overflow-hidden shrink-0",
              "hover:border-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-6 w-6 text-muted-foreground" />
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </button>
          <div className="text-sm text-muted-foreground">
            <p>Click to upload a photo</p>
            {hint && <p className="text-xs mt-0.5">{hint}</p>}
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          key={resetKey}
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    )
  }

  // filename mode
  const { filename, hint } = props
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium leading-none">{label}</p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose file
        </Button>
        <div className="min-w-0 text-sm text-muted-foreground truncate">
          {filename ? (
            <span className="text-foreground font-medium">{filename}</span>
          ) : hint ? (
            <span className="italic">{hint}</span>
          ) : (
            <span>No file chosen</span>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        key={resetKey}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
