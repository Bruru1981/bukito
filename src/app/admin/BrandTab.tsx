"use client";

import { useState, useEffect, useCallback, useRef, type DragEvent } from "react";

/* ─── Constants ─── */

const SUPABASE_URL = "https://glmgwaywptqlzudoiwot.supabase.co";
const STORAGE_BASE =
  `${SUPABASE_URL}/storage/v1/object/public/media/Bukito%20brand%20book`;
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWd3YXl3cHRxbHp1ZG9pd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjU3OTIsImV4cCI6MjA4OTkwMTc5Mn0.F2kYymu9_t9THk2VI_g4cgpYv70oa9CVIcsCKSb0LL8";

/* ─── Types ─── */

interface StorageFile {
  name: string;
  size: number;
  type: string;
  created_at: string;
}

type AssetCategory = "logos" | "wordmarks" | "icons" | "stamps" | "patterns" | "photos" | "videos";

const CATEGORIES: {
  key: AssetCategory;
  label: string;
  accept: string;
  prefix: string;
}[] = [
  { key: "logos", label: "LOGOS", accept: ".png,.svg", prefix: "Bukito brand book/logos/" },
  { key: "wordmarks", label: "WORDMARKS", accept: ".png,.svg", prefix: "Bukito brand book/wordmarks/" },
  { key: "icons", label: "ICONS", accept: ".png,.svg", prefix: "Bukito brand book/icons/" },
  { key: "stamps", label: "STAMPS & PATTERNS", accept: ".png,.svg,.jpg,.webp", prefix: "Bukito brand book/stamps/" },
  { key: "patterns", label: "PATTERNS", accept: ".png,.svg,.jpg,.webp", prefix: "Bukito brand book/patterns/" },
  { key: "photos", label: "PHOTOS", accept: ".webp,.jpg,.jpeg,.png", prefix: "Bukito brand book/photos/" },
  { key: "videos", label: "VIDEOS", accept: ".mp4,.mov,.webm", prefix: "Bukito brand book/videos/" },
];

/* ─── Shared styles (matching admin page) ─── */

const btnPrimary =
  "bg-sunrust text-sand px-4 py-2 rounded text-sm hover:bg-sunrust/90 transition-colors";

const btnDanger =
  "bg-red-700 text-sand px-3 py-1.5 rounded text-xs hover:bg-red-800 transition-colors";

const btnSecondary =
  "border border-sunrust/30 text-sunrust px-4 py-2 rounded text-sm hover:bg-sunrust/5 transition-colors";

const inputClass =
  "w-full px-3 py-2 border border-sunrust/20 bg-sand text-sunrust placeholder-sunrust/30 rounded focus:outline-none focus:border-sunrust text-sm";

/* ─── Helpers ─── */

function assetUrl(folder: string, filename: string): string {
  return `${STORAGE_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

async function fetchFiles(prefix: string): Promise<StorageFile[]> {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/media`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        prefix,
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      }),
    }
  );
  if (!res.ok) return [];
  const files = (await res.json()) as Array<{
    name: string;
    metadata?: { size?: number; mimetype?: string };
    created_at?: string;
  }>;
  return files
    .filter((f) => f.name && !f.name.endsWith("/") && f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      size: f.metadata?.size ?? 0,
      type: f.metadata?.mimetype ?? "",
      created_at: f.created_at ?? "",
    }));
}

/* ═══════════════════════════════════════════════════
   ASSET SECTION COMPONENT
   ═══════════════════════════════════════════════════ */

function AssetSection({
  category,
  label,
  accept,
  prefix,
  password,
  showToast,
}: {
  category: AssetCategory;
  label: string;
  accept: string;
  prefix: string;
  password: string;
  showToast: (msg: string) => void;
}) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchFiles(prefix);
    setFiles(result);
    setLoading(false);
  }, [prefix]);

  useEffect(() => {
    load();
  }, [load]);

  async function uploadFiles(fileList: FileList) {
    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", category);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
        body: formData,
      });

      if (res.ok) {
        successCount++;
      } else {
        const err = await res.json();
        showToast(`FAILED: ${file.name} — ${err.error ?? "Unknown error"}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      showToast(`UPLOADED ${successCount} FILE${successCount > 1 ? "S" : ""} TO ${label}`);
      load();
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function deleteFile(filename: string) {
    if (!confirm(`DELETE ${filename}?`)) return;

    const path = `${prefix}${filename}`;
    const res = await fetch("/api/admin/storage", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${password}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    if (res.ok) {
      showToast(`DELETED: ${filename}`);
      load();
    } else {
      const err = await res.json();
      showToast(`DELETE FAILED: ${err.error ?? "Unknown error"}`);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  const filteredFiles = search
    ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : files;

  const isImage = category !== "videos";
  const folderName = prefix.replace("Bukito brand book/", "").replace("/", "");

  return (
    <div className="border border-sunrust/10 rounded">
      {/* Header */}
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-sunrust/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <span className="text-base">
          {label}
          <span className="text-sunrust/40 ml-2 text-sm">
            ({loading ? "..." : files.length} FILE{files.length !== 1 ? "S" : ""})
          </span>
        </span>
        <span className="text-sunrust/40">{expanded ? "\u2212" : "+"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Search (only for icons and large collections) */}
          {(category === "icons" || files.length > 10) && (
            <input
              className={inputClass}
              placeholder={`SEARCH ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {/* Upload area */}
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed ${
              dragOver ? "border-sunrust/50 bg-sunrust/5" : "border-sunrust/15"
            } hover:border-sunrust/30 transition-colors p-6 text-center cursor-pointer rounded`}
          >
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              multiple
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              className="hidden"
            />
            {uploading ? (
              <p className="text-xs tracking-[0.1em] opacity-40">UPLOADING...</p>
            ) : (
              <div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mx-auto mb-2 opacity-20"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-xs tracking-[0.1em] opacity-30">
                  DROP FILES HERE OR CLICK TO UPLOAD
                </p>
                <p
                  className="text-[10px] opacity-15 mt-1"
                  style={{ fontFamily: "var(--font-kisrre-rounded)" }}
                >
                  Accepted: {accept}
                </p>
              </div>
            )}
          </div>

          {/* File grid */}
          {loading ? (
            <p className="text-sunrust/40 text-sm">LOADING...</p>
          ) : filteredFiles.length === 0 ? (
            <p className="text-sunrust/30 text-sm text-center py-4">
              {search ? "NO FILES MATCH YOUR SEARCH" : "NO FILES YET"}
            </p>
          ) : isImage ? (
            /* Image grid */
            <div className={`grid gap-3 ${
              category === "icons"
                ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
                : category === "photos"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
            }`}>
              {filteredFiles.map((file) => (
                <div key={file.name} className="group relative">
                  <div
                    className={`border border-sunrust/10 overflow-hidden flex items-center justify-center ${
                      category === "photos" ? "aspect-square" : "aspect-square p-2"
                    }`}
                  >
                    <img
                      src={assetUrl(folderName, file.name)}
                      alt={file.name}
                      className={
                        category === "photos"
                          ? "w-full h-full object-cover"
                          : "max-w-full max-h-full object-contain"
                      }
                      loading="lazy"
                    />
                  </div>
                  {/* Overlay with delete */}
                  <div className="absolute inset-0 bg-black-magic/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded">
                    <p className="text-sand text-[9px] px-2 text-center truncate max-w-full">
                      {file.name}
                    </p>
                    {file.size > 0 && (
                      <p className="text-sand/50 text-[8px]">{formatBytes(file.size)}</p>
                    )}
                    <button
                      className={btnDanger}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.name);
                      }}
                      type="button"
                    >
                      DELETE
                    </button>
                  </div>
                  <p className="text-[9px] text-sunrust/30 truncate mt-1 px-0.5">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Video list */
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between border border-sunrust/10 rounded px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="opacity-30 shrink-0"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-[10px] text-sunrust/30">
                        {file.size > 0 ? formatBytes(file.size) : ""}
                        {file.type ? ` — ${file.type}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    className={btnDanger}
                    onClick={() => deleteFile(file.name)}
                    type="button"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BRAND TAB (main export)
   ═══════════════════════════════════════════════════ */

export function BrandTab({
  password,
  showToast,
}: {
  password: string;
  showToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg mb-2">BRAND ASSETS</h2>
        <p
          className="text-sm opacity-40"
          style={{ fontFamily: "var(--font-kisrre-rounded)" }}
        >
          Manage All Brand Assets — Logos, Wordmarks, Icons, Photos, And Videos
        </p>
        <a
          href="/brand-book"
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnSecondary} inline-block mt-3`}
        >
          VIEW PUBLIC BRAND BOOK
        </a>
      </div>

      {CATEGORIES.map((cat) => (
        <AssetSection
          key={cat.key}
          category={cat.key}
          label={cat.label}
          accept={cat.accept}
          prefix={cat.prefix}
          password={password}
          showToast={showToast}
        />
      ))}
    </div>
  );
}
