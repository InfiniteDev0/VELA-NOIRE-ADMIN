"use client";

/**
 * MediaUploader
 *
 * Production-grade direct-to-Cloudinary uploader.
 * Files NEVER pass through our backend — only the signature is fetched,
 * then the client uploads straight to Cloudinary's CDN.
 *
 * Props:
 *   folder      — "products" | "variants" | "collections" | "videos" | "measurements"
 *   type        — "image" (default) | "video"
 *   multiple    — allow multiple files (default false)
 *   maxFiles    — max number of files when multiple=true (default 10)
 *   accept      — MIME types string, e.g. "image/*" or "video/*"
 *   value       — current array of { url, publicId } objects
 *   onChange    — called with updated array of { url, publicId }
 *   className   — extra classes for the drop zone
 *   label       — drop zone label text
 */

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  VideoIcon,
  X,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─────────────────────────────────────────────
// Fetch a signed upload token from our backend
// ─────────────────────────────────────────────
async function getSignature(folder, type) {
  const res = await fetch(
    `${BACKEND_URL}/api/upload/sign?folder=${folder}&type=${type}`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to get upload signature.");
  return res.json();
}

// ─────────────────────────────────────────────
// Upload a single File directly to Cloudinary
// Returns { url, publicId }
// ─────────────────────────────────────────────
async function uploadToCloudinary(file, signedParams, onProgress) {
  const {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    eager,
    resourceType,
  } = signedParams;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  if (eager) formData.append("eager", eager);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType || "image"}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export function MediaUploader({
  folder = "products",
  type = "image",
  multiple = false,
  maxFiles = 10,
  accept,
  value = [],
  onChange,
  className,
  label,
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState([]); // [{ name, progress, error }]
  const inputRef = useRef(null);

  const acceptAttr = accept || (type === "video" ? "video/*" : "image/*");
  const isImage = type === "image";
  const Icon = isImage ? ImageIcon : VideoIcon;

  const canAddMore = multiple ? value.length < maxFiles : value.length === 0;

  // ── Process selected files ──────────────────
  const handleFiles = useCallback(
    async (files) => {
      if (!files.length) return;

      const toUpload = Array.from(files).slice(0, maxFiles - value.length);
      if (!toUpload.length) return;

      // Basic client-side type check
      const invalid = toUpload.filter((f) => !f.type.startsWith(type + "/"));
      if (invalid.length) {
        alert(`Only ${type} files are allowed.`);
        return;
      }

      // Initialise progress state for each file
      const slots = toUpload.map((f) => ({
        name: f.name,
        progress: 0,
        error: null,
      }));
      setUploading((prev) => [...prev, ...slots]);

      // Fetch one signature (reused for all files in this batch)
      let signedParams;
      try {
        signedParams = await getSignature(folder, type);
      } catch (err) {
        setUploading((prev) =>
          prev.map((s, i) =>
            slots.some((sl) => sl.name === s.name)
              ? { ...s, error: "Auth failed" }
              : s,
          ),
        );
        return;
      }

      // Upload concurrently (max 3 at a time via sequential chunking)
      const results = [];
      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i];
        const slotName = slots[i].name;
        try {
          const result = await uploadToCloudinary(file, signedParams, (pct) => {
            setUploading((prev) =>
              prev.map((s) =>
                s.name === slotName ? { ...s, progress: pct } : s,
              ),
            );
          });
          results.push(result);
        } catch (err) {
          setUploading((prev) =>
            prev.map((s) =>
              s.name === slotName ? { ...s, error: err.message } : s,
            ),
          );
        }
      }

      // Clear finished (non-errored) slots from progress list
      setUploading((prev) =>
        prev.filter((s) => slots.every((sl) => sl.name !== s.name) || s.error),
      );

      if (results.length) {
        onChange?.(multiple ? [...value, ...results] : [results[0]]);
      }
    },
    [folder, type, multiple, maxFiles, value, onChange],
  );

  // ── Drag & drop ─────────────────────────────
  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── Remove existing asset from value ────────
  const remove = (publicId) => {
    onChange?.(value.filter((v) => v.publicId !== publicId));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone — only shown when more files can be added */}
      {canAddMore && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            "min-h-[120px] px-4 py-6 text-center",
            dragging
              ? "border-white/60 bg-white/5"
              : "border-border hover:border-white/30 hover:bg-white/[0.02]",
          )}
        >
          <Icon className="size-7 text-muted-foreground" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              {label ||
                `Upload ${isImage ? "image" : "video"}${multiple ? "s" : ""}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse
              {multiple &&
                value.length > 0 &&
                ` · ${maxFiles - value.length} remaining`}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            multiple={multiple}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Upload progress rows */}
      {uploading.map((slot, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm"
        >
          {slot.error ? (
            <AlertCircle className="size-4 shrink-0 text-destructive" />
          ) : (
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs">{slot.name}</p>
            {!slot.error && (
              <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-200 rounded-full"
                  style={{ width: `${slot.progress}%` }}
                />
              </div>
            )}
            {slot.error && (
              <p className="text-xs text-destructive mt-0.5">{slot.error}</p>
            )}
          </div>
          {!slot.error && (
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
              {slot.progress}%
            </span>
          )}
        </div>
      ))}

      {/* Existing uploaded files preview grid */}
      {value.length > 0 && (
        <div
          className={cn(
            "grid gap-2",
            multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1",
          )}
        >
          {value.map((asset) => (
            <div
              key={asset.publicId}
              className="group relative rounded-lg overflow-hidden border border-border bg-card"
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt=""
                  className={cn(
                    "w-full object-cover",
                    multiple ? "h-24" : "h-48",
                  )}
                />
              ) : (
                <video
                  src={asset.url}
                  className="w-full h-48 object-cover"
                  muted
                  playsInline
                />
              )}
              <button
                type="button"
                onClick={() => remove(asset.publicId)}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
