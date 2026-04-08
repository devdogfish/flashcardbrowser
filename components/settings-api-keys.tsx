"use client"

import { useState, useTransition } from "react"
import { Copy, Check, Trash2, Plus, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createApiKey, deleteApiKey } from "@/app/actions"
import { cn } from "@/lib/utils"

interface ApiKeyRow {
  id: string
  name: string
  createdAt: string
  lastUsedAt: string | null
}

interface Props {
  keys: ApiKeyRow[]
}

function RevealableKey({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
      <KeyRound className="w-3.5 h-3.5 text-green-500 shrink-0" />
      <code className={cn("flex-1 text-xs font-mono text-green-600 dark:text-green-400 truncate select-all", !visible && "blur-[3px]")}>
        {apiKey}
      </code>
      <button type="button" onClick={() => setVisible((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
        {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button type="button" onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors p-1">
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

export function SettingsApiKeys({ keys }: Props) {
  const [newName, setNewName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, startCreate] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = () => {
    if (!newName.trim()) return
    setError(null)
    setNewKey(null)
    startCreate(async () => {
      try {
        const { key } = await createApiKey(newName.trim())
        setNewKey(key)
        setNewName("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create key")
      }
    })
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteApiKey(id)
    } catch {
      // key list will refresh via revalidatePath
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Existing keys */}
      {keys.length > 0 && (
        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/20"
            >
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{k.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Created {new Date(k.createdAt).toLocaleDateString()}
                  {k.lastUsedAt && (
                    <> · Last used {new Date(k.lastUsedAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(k.id)}
                disabled={deletingId === k.id}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                aria-label="Revoke key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Newly created key — shown once */}
      {newKey && <RevealableKey apiKey={newKey} />}
      {newKey && (
        <p className="text-xs text-muted-foreground">
          Copy this key now — it won&apos;t be shown again.
        </p>
      )}

      {/* Create form */}
      <div className="flex gap-2">
        <Input
          placeholder="Key name (e.g. My LLM)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          className="gap-1.5 shrink-0 h-9"
        >
          <Plus className="w-3.5 h-3.5" />
          {creating ? "Creating…" : "New key"}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Use API keys to create decks programmatically.{" "}
        <a href="/docs#api" className="text-foreground underline underline-offset-4 hover:no-underline">
          See the API docs <ArrowRight className="inline w-3 h-3" />
        </a>
      </p>
    </div>
  )
}
