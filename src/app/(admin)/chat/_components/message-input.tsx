"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Paperclip, Send, Smile, X, FileText } from "lucide-react"
import type { EmojiClickData } from "emoji-picker-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Loaded on demand — heavy bundle, skip SSR
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

interface PendingFile {
  file: File
  previewUrl?: string
}

interface Props {
  onSend: (content: string, file?: File) => Promise<void>
  disabled?: boolean
}

function isImage(file: File) {
  return file.type.startsWith("image/")
}

export function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("")
  const [pending, setPending] = useState<PendingFile | null>(null)
  const [sending, setSending] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPos, setPickerPos] = useState<{ bottom: number; left: number } | null>(null)

  const textareaRef  = useRef<HTMLTextAreaElement>(null)
  const pickerRef    = useRef<HTMLDivElement>(null)
  const emojiBtnRef  = useRef<HTMLButtonElement>(null)
  const fileRef      = useRef<HTMLInputElement>(null)

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return
    function handler(e: MouseEvent) {
      const target = e.target as Node
      if (
        pickerRef.current  && !pickerRef.current.contains(target) &&
        emojiBtnRef.current && !emojiBtnRef.current.contains(target)
      ) setShowPicker(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showPicker])

  function togglePicker() {
    if (showPicker) { setShowPicker(false); return }
    if (emojiBtnRef.current) {
      const r = emojiBtnRef.current.getBoundingClientRect()
      setPickerPos({
        bottom: window.innerHeight - r.top + 8,
        left: Math.max(8, r.left),
      })
    }
    setShowPicker(true)
  }

  function handleEmojiClick(data: EmojiClickData) {
    const emoji = data.emoji
    const el    = textareaRef.current
    if (!el) { setText((t) => t + emoji); return }

    const start   = el.selectionStart ?? text.length
    const end     = el.selectionEnd   ?? text.length
    setText(text.slice(0, start) + emoji + text.slice(end))

    requestAnimationFrame(() => {
      el.setSelectionRange(start + emoji.length, start + emoji.length)
      el.focus()
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPending({ file, previewUrl: isImage(file) ? URL.createObjectURL(file) : undefined })
    e.target.value = ""
  }

  function removePending() {
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    setPending(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if ((!text.trim() && !pending) || sending) return
    setSending(true)
    try {
      await onSend(text.trim(), pending?.file)
      setText("")
      removePending()
      setShowPicker(false)
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const canSend = (text.trim().length > 0 || pending !== null) && !sending && !disabled

  return (
    <div className="border-t border-slate-200 bg-white shrink-0">
      {/* File preview strip */}
      {pending && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50">
          {pending.previewUrl ? (
            <img src={pending.previewUrl} alt="preview" className="h-14 w-14 rounded object-cover shrink-0" />
          ) : (
            <div className="h-14 w-14 rounded bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{pending.file.name}</p>
            <p className="text-[11px] text-gray-400">{(pending.file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={removePending} className="h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Emoji picker — fixed so it escapes overflow-hidden ancestors */}
      {showPicker && pickerPos && (
        <div
          ref={pickerRef}
          style={{ position: "fixed", bottom: pickerPos.bottom, left: pickerPos.left, zIndex: 9999 }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            skinTonesDisabled
            height={350}
            width={320}
            lazyLoadEmojis
          />
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 px-4 py-3">
        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={handleFileChange} />

        {/* Attach file */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || sending}
          title="Attach file"
          className={cn(
            "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
            "text-gray-400 hover:text-blue-600 hover:bg-blue-50",
            (disabled || sending) && "opacity-40 pointer-events-none",
          )}
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Emoji */}
        <button
          ref={emojiBtnRef}
          type="button"
          onClick={togglePicker}
          disabled={disabled || sending}
          title="Emoji"
          className={cn(
            "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
            showPicker ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50",
            (disabled || sending) && "opacity-40 pointer-events-none",
          )}
        >
          <Smile className="h-4 w-4" />
        </button>

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={pending ? "Add a caption… (optional)" : "Type a message…"}
          disabled={disabled || sending}
          rows={1}
          className="flex-1 resize-none min-h-[40px] max-h-32 text-sm"
        />

        <Button type="submit" size="icon" disabled={!canSend} className="shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
