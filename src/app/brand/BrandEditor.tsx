"use client";

import { useState, useEffect, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";

/* ─── Types ─── */
interface ColorItem {
  name: string;
  hex: string;
  role: string;
}

interface PaperWorkspace {
  label: string;
  url: string;
  description: string;
}

interface BrandSettings {
  paperUrl: string;
  paperWorkspaces: PaperWorkspace[];
  colors: {
    primary: ColorItem[];
    secondary: ColorItem[];
  };
}

/* ─── Paper Workspace Manager ─── */
export function WorkspaceManager() {
  const [workspaces, setWorkspaces] = useState<PaperWorkspace[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brand")
      .then((r) => r.json())
      .then((d: BrandSettings) => {
        setWorkspaces(d.paperWorkspaces || []);
        setLoading(false);
      });
  }, []);

  const updateWorkspace = (index: number, field: keyof PaperWorkspace, value: string) => {
    const next = [...workspaces];
    next[index] = { ...next[index], [field]: value };
    setWorkspaces(next);
  };

  const addWorkspace = () => {
    setWorkspaces([...workspaces, { label: "", url: "", description: "" }]);
  };

  const removeWorkspace = (index: number) => {
    setWorkspaces(workspaces.filter((_, i) => i !== index));
  };

  const save = useCallback(async () => {
    setSaved(false);
    await fetch("/api/brand", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperWorkspaces: workspaces }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [workspaces]);

  if (loading) return <div className="h-[120px]" />;

  return (
    <div className="flex flex-col gap-4">
      {workspaces.map((ws, i) => (
        <div key={i} className="border border-sunrust/10 p-4 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <input
              value={ws.label}
              onChange={(e) => updateWorkspace(i, "label", e.target.value)}
              placeholder="Workspace name..."
              className="w-40 bg-transparent border border-sunrust/15 px-3 py-1.5 text-sm tracking-[-0.02em] placeholder:opacity-20 focus:border-sunrust/40 outline-none"
            />
            <input
              type="url"
              value={ws.url}
              onChange={(e) => updateWorkspace(i, "url", e.target.value)}
              placeholder="https://paper.design/doc/..."
              className="flex-1 bg-transparent border border-sunrust/15 px-3 py-1.5 text-sm tracking-[-0.02em] placeholder:opacity-20 focus:border-sunrust/40 outline-none"
            />
            <button
              onClick={() => removeWorkspace(i)}
              className="text-sunrust/30 hover:text-sunrust/60 transition-colors cursor-pointer px-2"
              title="Remove workspace"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <input
            value={ws.description}
            onChange={(e) => updateWorkspace(i, "description", e.target.value)}
            placeholder="What this workspace is for..."
            className="bg-transparent border border-sunrust/8 px-3 py-1 text-[11px] opacity-50 placeholder:opacity-30 focus:border-sunrust/25 outline-none"
            style={{ fontFamily: "var(--font-kisrre-rounded)" }}
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={addWorkspace}
          className="px-4 py-1.5 text-[11px] tracking-[0.1em] border border-dashed border-sunrust/20 hover:border-sunrust/40 transition-colors cursor-pointer"
        >
          + Add Workspace
        </button>
        <button
          onClick={save}
          className="px-4 py-1.5 text-[11px] tracking-[0.1em] bg-sunrust text-sand hover:bg-sunrust/80 transition-colors cursor-pointer"
        >
          {saved ? "Saved" : "Save Workspaces"}
        </button>
      </div>

      <p className="text-[11px] opacity-20" style={{ fontFamily: "var(--font-kisrre-rounded)" }}>
        Each workspace is a separate Paper file. Rubin and Helena pick the right one when starting work.
      </p>
    </div>
  );
}

/* ─── Color Editor ─── */
export function ColorEditor({
  group,
  initial,
}: {
  group: "primary" | "secondary";
  initial: ColorItem[];
}) {
  const [colors, setColors] = useState(initial);
  const [saved, setSaved] = useState(false);

  const updateColor = (index: number, hex: string) => {
    const next = [...colors];
    next[index] = { ...next[index], hex };
    setColors(next);
  };

  const save = useCallback(async () => {
    setSaved(false);
    const res = await fetch("/api/brand");
    const current: BrandSettings = await res.json();
    await fetch("/api/brand", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: { ...current.colors, [group]: colors },
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [colors, group]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {colors.map((c, i) => (
          <div key={c.name} className="flex items-center gap-4">
            <label className="relative w-16 h-16 shrink-0 border border-sunrust/10 cursor-pointer group">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: c.hex }}
              />
              <input
                type="color"
                value={c.hex}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateColor(i, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black-magic/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
            </label>
            <div>
              <p className="text-sm tracking-[-0.02em]">{c.name}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(c.hex);
                }}
                className="text-xs opacity-40 mt-0.5 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                title="Click to copy"
              >
                {c.hex} — {c.role}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={save}
        className="mt-4 px-4 py-1.5 text-[11px] tracking-[0.1em] border border-sunrust/15 hover:bg-sunrust hover:text-sand transition-colors cursor-pointer"
      >
        {saved ? "Saved" : "Save Colors"}
      </button>
    </div>
  );
}

/* ─── Media Upload (Photos + Videos) ─── */
export function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setMessage("");

    const results: string[] = [];
    for (const file of Array.from(files)) {
      const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isMedia) continue;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/brand/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const icon = data.type === "video" ? "\u25B6" : "\u2713";
        results.push(`${icon} ${data.filename}`);
      } else {
        results.push(`Failed: ${file.name}`);
      }
    }

    setUploading(false);
    setMessage(results.length ? `Uploaded: ${results.join(", ")}` : "No media selected");
    setTimeout(() => setMessage(""), 5000);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-sunrust/15 hover:border-sunrust/30 transition-colors p-8 text-center cursor-pointer"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <p className="text-xs tracking-[0.1em] opacity-40">Uploading...</p>
        ) : (
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto mb-3 opacity-20"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-xs tracking-[0.1em] opacity-30">
              Drop Photos Or Videos Here
            </p>
            <p
              className="text-[11px] opacity-15 mt-1"
              style={{ fontFamily: "var(--font-kisrre-rounded)" }}
            >
              Images: webp, jpg, png — Videos: mp4, webm, mov
            </p>
          </div>
        )}
      </div>
      {message && (
        <p className="text-xs text-jungle mt-3">{message}</p>
      )}
    </div>
  );
}

/* ─── Click-to-copy hex ─── */
export function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
      style={{ fontFamily: "var(--font-kisrre-rounded)" }}
      title="Click to copy"
    >
      {copied ? "Copied!" : hex}
    </button>
  );
}
