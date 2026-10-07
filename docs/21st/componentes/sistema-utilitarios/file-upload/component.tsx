"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  Link2,
  Loader2,
  RotateCcw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

/* ==========================================================================
   FileUpload

   Most upload widgets are a drop zone and a list of bars. They look finished
   and then fall over on the three things that actually happen to people.

   A file gets rejected. It is too big, or it is the wrong kind. The common
   behaviour is to swallow it — the user drops eight files, seven appear, and
   nobody says which one went missing or why. Here a rejected file still gets
   a row, in red, naming the reason. You cannot fix what you cannot see.

   An upload fails. Networks drop. So a failed row keeps its place and grows a
   Retry button rather than disappearing, and retrying resumes from the same
   row instead of asking the user to find the file again.

   An upload is slow. A percentage answers the wrong question; what the user
   wants to know is when they can leave. So the line under each name reads
   "1.4 MB of 12 MB · 18s left", computed from the rate actually observed.

   Three smaller things earn their place:

   The drag state is counted, not toggled. Dragging over a child element fires
   dragleave on the parent, which is why so many drop zones flicker; a depth
   counter fixes it.

   Images show themselves. A thumbnail from an object URL is worth more than a
   generic sheet-of-paper icon when you are checking you grabbed the right
   screenshot — and every object URL is revoked when its row goes.

   The zone takes a paste. Screenshot to clipboard, click, Cmd+V — the fastest
   path from screen to upload, and almost nobody wires it up.

   The component owns the queue, not the transport. Pass `uploader` and it
   drives your real request, with an AbortSignal for cancel; without it the
   demo uploader runs so the thing works out of the box.
   ========================================================================== */

const FONT_STACK =
  '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;
const SOFT = { type: "spring", stiffness: 300, damping: 30 } as const;
const SQUIRCLE = "[corner-shape:squircle]";
const EDGE = "ring-1 ring-inset ring-black/[0.12] dark:ring-white/[0.16]";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/25 dark:focus-visible:ring-white/30";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */

export type UploadStatus = "queued" | "uploading" | "done" | "error";

export type UploadItem = {
  id: string;
  name: string;
  /** Total size in bytes. 0 when a URL import has not reported one. */
  size: number;
  /** Bytes transferred so far. */
  loaded: number;
  status: UploadStatus;
  /** Why it failed, in words the user can act on. */
  error?: string;
  /**
   * Whether retrying could work. A dropped connection, yes; a 60 MB file
   * against a 50 MB limit, no — offering Retry there just wastes a click.
   */
  retriable?: boolean;
  /** Object URL for an image, or a remote thumbnail. */
  preview?: string;
  /** Where the finished file lives, once the uploader reports it. */
  url?: string;
  source: "file" | "url";
  /** The browser File, when there is one — yours to send. */
  file?: File;
};

export type Uploader = (
  item: UploadItem,
  ctx: { onProgress: (loaded: number) => void; signal: AbortSignal },
) => Promise<{ url?: string } | void>;

export type FileUploadProps = {
  title?: string;
  description?: string;
  /** Accepted types, as extensions or MIME patterns: [".pdf", "image/*"]. */
  accept?: string[];
  /** Largest file allowed, in bytes. */
  maxSize?: number;
  /** Cap on rows; further files are rejected with a reason. */
  maxFiles?: number;
  multiple?: boolean;
  /** Show the "import from URL" field under the drop zone. */
  allowUrlImport?: boolean;
  /**
   * Start sending the moment a file is added. Off means files wait in the
   * queue until the user presses Upload — which is the right default when
   * the upload is expensive, or when they are still assembling the set.
   */
  autoUpload?: boolean;
  /** Hide the bottom action bar entirely, e.g. when the page has its own. */
  showActions?: boolean;
  /** Label on the primary button once everything has finished. */
  submitLabel?: string;
  /** Called when the user confirms the finished set. */
  onSubmit?: (items: UploadItem[]) => void;
  /** Drives the actual transfer. Omit and a demo uploader stands in. */
  uploader?: Uploader;
  /** Height of the scrolling list before it scrolls. */
  maxHeight?: number;
  onChange?: (items: UploadItem[]) => void;
  onComplete?: (item: UploadItem) => void;
  onRemove?: (item: UploadItem) => void;
  /** Rendered under the list — a submit button, usually. */
  footer?: React.ReactNode;
  /** Given, the header grows a close button. Set for you inside the dialog. */
  onClose?: () => void;
  className?: string;
};

/* -------------------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10);

export function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

function formatEta(seconds: number) {
  if (!isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 60) return `${Math.ceil(seconds)}s left`;
  const m = Math.floor(seconds / 60);
  return `${m}m ${Math.ceil(seconds % 60)}s left`;
}

function extOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase().slice(0, 4) : "FILE";
}

/* Badge colours, from the same families the rest of the set uses. */
const EXT_TINT: Record<string, string> = {
  PDF: "bg-red-500",
  DOC: "bg-blue-500",
  DOCX: "bg-blue-500",
  CSV: "bg-emerald-500",
  XLS: "bg-emerald-500",
  XLSX: "bg-emerald-500",
  PNG: "bg-violet-500",
  JPG: "bg-violet-500",
  JPEG: "bg-violet-500",
  WEBP: "bg-violet-500",
  GIF: "bg-violet-500",
  MP4: "bg-amber-500",
  MOV: "bg-amber-500",
  ZIP: "bg-neutral-500",
};

const tintFor = (ext: string) => EXT_TINT[ext] ?? "bg-neutral-500";

/** Does this file satisfy one of the accept patterns? */
function matches(file: { name: string; type: string }, accept: string[]) {
  if (!accept.length) return true;
  const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
  return accept.some((a) => {
    const rule = a.trim().toLowerCase();
    if (rule.startsWith(".")) return ext === rule;
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

/** A short, human list of what is allowed: "JPEG, PNG, PDF and MP4". */
function acceptLabel(accept: string[]) {
  const names = accept.map((a) =>
    a.startsWith(".")
      ? a.slice(1).toUpperCase()
      : a.endsWith("/*")
        ? a.slice(0, -2).toUpperCase()
        : (a.split("/").pop() ?? a).toUpperCase(),
  );
  const seen = [...new Set(names)];
  if (seen.length < 2) return seen[0] ?? "Any";
  return seen.slice(0, -1).join(", ") + " and " + seen[seen.length - 1];
}

/* -------------------------------------------------------------------------- */

/**
 * The stand-in transport.
 *
 * It moves bytes at a plausible rate so progress, ETA and cancel all behave
 * the way they will against a real endpoint. Replace it with `uploader`.
 */
export const simulateUpload: Uploader = (item, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    const total = item.size || 1024 * 512;
    /* Somewhere around 1.4 MB/s, which is slow enough to watch. */
    const rate = 1_400_000;
    let loaded = item.loaded;
    let last = performance.now();

    const tick = () => {
      if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
      const now = performance.now();
      loaded = Math.min(total, loaded + ((now - last) / 1000) * rate);
      last = now;
      onProgress(loaded);
      if (loaded >= total) return resolve({});
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    signal.addEventListener("abort", () => cancelAnimationFrame(raf), { once: true });
  });

/* -------------------------------------------------------------------------- */

function Thumb({ item }: { item: UploadItem }) {
  const ext = extOf(item.name);
  const [broken, setBroken] = React.useState(false);

  if (item.preview && !broken) {
    return (
      <img
        src={item.preview}
        alt=""
        draggable={false}
        onError={() => setBroken(true)}
        className={cn("h-10 w-10 shrink-0 rounded-[10px] object-cover", SQUIRCLE, EDGE)}
      />
    );
  }

  /* A sheet with a corner folded and the extension stamped on it — the
     extension is the part people actually read, so it gets the colour. */
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-end justify-items-start rounded-[10px] bg-neutral-100 p-1 dark:bg-white/[0.07]",
        SQUIRCLE,
        EDGE,
      )}
    >
      <FileText className="absolute top-1 right-1 h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
      <span
        className={cn(
          "rounded-[4px] px-1 py-px text-[8px] font-bold tracking-[0.02em] text-white",
          tintFor(ext),
        )}
      >
        {ext}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */

function Row({
  item,
  onCancel,
  onRetry,
  onRemove,
}: {
  item: UploadItem;
  onCancel: () => void;
  onRetry: () => void;
  onRemove: () => void;
}) {
  const reduced = useReducedMotion();
  /* Waiting for the user is not the same as waiting for the network, and
     showing a spinner for the first is how a queue looks stuck. */
  const pending = item.status === "queued";
  const busy = item.status === "uploading";
  const failed = item.status === "error";
  const pct = item.size ? Math.min(100, (item.loaded / item.size) * 100) : 0;

  /* The rate is measured over the life of the row rather than frame to
     frame, so the estimate settles instead of jittering. */
  const startedRef = React.useRef(0);
  if (item.status === "uploading" && !startedRef.current) startedRef.current = performance.now();
  let eta: string | null = null;
  if (item.status === "uploading" && item.loaded > 0 && startedRef.current) {
    const elapsed = (performance.now() - startedRef.current) / 1000;
    const rate = item.loaded / Math.max(0.25, elapsed);
    eta = formatEta((item.size - item.loaded) / Math.max(1, rate));
  }

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12, scale: 0.985 }}
      transition={reduced ? { duration: 0 } : SPRING}
      className={cn(
        "list-none rounded-[14px] border bg-white px-3 py-2.5 dark:bg-neutral-900",
        SQUIRCLE,
        failed
          ? "border-red-200 bg-red-50 dark:border-red-500/35 dark:bg-red-500/[0.10]"
          : "border-black/[0.08] dark:border-white/[0.09]",
      )}
    >
      <div className="flex items-center gap-3">
        <Thumb item={item} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="m-0 truncate text-[13px] font-medium text-neutral-900 dark:text-neutral-50">
              {item.name}
            </p>
            {item.source === "url" ? (
              <Link2 aria-hidden className="h-3 w-3 shrink-0 text-neutral-400" />
            ) : null}
          </div>

          {/* one dim line that answers "how far, how long, or what went wrong" */}
          <p className="m-0 mt-0.5 flex items-center gap-1.5 truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {failed ? (
              <>
                <AlertCircle aria-hidden className="h-3 w-3 shrink-0 text-red-500" />
                <span className="truncate text-red-600 dark:text-red-300">{item.error}</span>
              </>
            ) : pending ? (
              <>
                <Clock aria-hidden className="h-3 w-3 shrink-0 text-neutral-400" />
                Ready to upload · {formatBytes(item.size)}
              </>
            ) : item.status === "done" ? (
              <>
                <CheckCircle2 aria-hidden className="h-3 w-3 shrink-0 text-emerald-500" />
                {formatBytes(item.size)} · Completed
              </>
            ) : (
              <>
                <Loader2 aria-hidden className="h-3 w-3 shrink-0 animate-spin text-neutral-400" />
                {formatBytes(item.loaded)} of {formatBytes(item.size)}
                {eta ? <span className="text-neutral-400">· {eta}</span> : null}
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {failed && item.retriable ? (
            <button
              type="button"
              onClick={onRetry}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-[8px] px-2 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:bg-white/[0.08]",
                SQUIRCLE,
                FOCUS,
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          ) : null}

          <button
            type="button"
            onClick={busy ? onCancel : onRemove}
            aria-label={busy ? `Cancel ${item.name}` : `Remove ${item.name}`}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-[8px] text-neutral-400 transition-colors hover:bg-black/[0.05] hover:text-neutral-700 dark:hover:bg-white/[0.08] dark:hover:text-neutral-100",
              SQUIRCLE,
              FOCUS,
            )}
          >
            {busy ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* The bar only exists while it means something. A full bar left under a
          finished row is noise the eye has to re-check every time. */}
      <AnimatePresence initial={false}>
        {busy ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 4, marginTop: 10 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }}
            transition={reduced ? { duration: 0 } : SOFT}
            className="overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.12]"
          >
            <motion.div
              className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.18, ease: "linear" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    title = "Upload files",
    description = "Select and upload the files of your choice",
    accept = ["image/jpeg", "image/png", "application/pdf", "video/mp4"],
    maxSize = 50 * 1024 * 1024,
    maxFiles,
    multiple = true,
    allowUrlImport = true,
    uploader = simulateUpload,
    autoUpload = true,
    showActions = true,
    submitLabel,
    onSubmit,
    maxHeight = 260,
    onChange,
    onComplete,
    onRemove,
    footer,
    onClose,
    className,
  },
  ref,
) {
  const reduced = useReducedMotion();
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [urlValue, setUrlValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  /* dragenter fires again for every child the pointer crosses, so the depth
     is counted rather than toggled — otherwise the zone flickers. */
  const depth = React.useRef(0);

  /* One controller per row, so a single cancel does not take the queue down. */
  const controllers = React.useRef(new Map<string, AbortController>());
  /* Object URLs to hand back when their rows go. */
  const objectUrls = React.useRef(new Set<string>());

  const latest = React.useRef(items);
  latest.current = items;

  /* Whether the list has content below the fold, so the fade can say so. */
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [spill, setSpill] = React.useState(false);
  const trackScroll = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setSpill(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  }, []);
  React.useLayoutEffect(trackScroll, [items, trackScroll]);

  React.useEffect(
    () => () => {
      controllers.current.forEach((c) => c.abort());
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const patch = React.useCallback(
    (id: string, next: Partial<UploadItem>) => {
      setItems((list) => {
        const out = list.map((i) => (i.id === id ? { ...i, ...next } : i));
        onChange?.(out);
        return out;
      });
    },
    [onChange],
  );

  /* -- the transfer ------------------------------------------------------- */

  const start = React.useCallback(
    async (item: UploadItem) => {
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      patch(item.id, { status: "uploading", error: undefined });

      try {
        const res = await uploader(
          { ...item, status: "uploading" },
          {
            onProgress: (loaded) => patch(item.id, { loaded: Math.max(0, loaded) }),
            signal: controller.signal,
          },
        );
        patch(item.id, {
          status: "done",
          loaded: item.size,
          url: (res && "url" in res ? res.url : undefined) ?? item.url,
        });
        const done = latest.current.find((i) => i.id === item.id);
        if (done) onComplete?.({ ...done, status: "done" });
      } catch (err) {
        /* A cancel is the user's decision, not a failure to report. */
        if ((err as Error)?.name === "AbortError") return;
        patch(item.id, {
          status: "error",
          retriable: true,
          error: err instanceof Error && err.message ? err.message : "Upload failed",
        });
      } finally {
        controllers.current.delete(item.id);
      }
    },
    [patch, uploader, onComplete],
  );

  /* -- taking files in ---------------------------------------------------- */

  const add = React.useCallback(
    (files: File[]) => {
      if (!files.length) return;
      const room =
        maxFiles === undefined ? Infinity : Math.max(0, maxFiles - latest.current.length);

      const next: UploadItem[] = [];
      files.slice(0, multiple ? files.length : 1).forEach((file, i) => {
        const base: UploadItem = {
          id: uid(),
          name: file.name,
          size: file.size,
          loaded: 0,
          status: "queued",
          source: "file",
          file,
        };

        /* A rejected file still gets a row. Silently dropping it is how
           people end up submitting a form that is missing something. */
        if (i >= room) {
          next.push({ ...base, status: "error", error: `Limit of ${maxFiles} files reached` });
          return;
        }
        if (!matches(file, accept)) {
          next.push({ ...base, status: "error", error: `${extOf(file.name)} files aren't accepted` });
          return;
        }
        if (file.size > maxSize) {
          next.push({
            ...base,
            status: "error",
            error: `Too large — ${formatBytes(file.size)} of ${formatBytes(maxSize)} allowed`,
          });
          return;
        }

        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          objectUrls.current.add(url);
          base.preview = url;
        }
        next.push(base);
      });

      setItems((list) => {
        const out = multiple ? [...list, ...next] : next;
        onChange?.(out);
        return out;
      });
      if (autoUpload) next.filter((i) => i.status === "queued").forEach(start);
    },
    [accept, autoUpload, maxFiles, maxSize, multiple, onChange, start],
  );

  const addUrl = React.useCallback(
    (raw: string) => {
      const value = raw.trim();
      if (!value) return;
      let name = value;
      try {
        const parsed = new URL(value);
        name = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? parsed.hostname);
      } catch {
        /* Not a URL we can parse — say so on the row rather than in a toast
           the user has already looked away from. */
        const bad: UploadItem = {
          id: uid(),
          name: value.slice(0, 60),
          size: 0,
          loaded: 0,
          status: "error",
          error: "That doesn't look like a valid link",
          source: "url",
        };
        setItems((list) => [...list, bad]);
        setUrlValue("");
        return;
      }

      const item: UploadItem = {
        id: uid(),
        name: name || "Linked file",
        /* Unknown until the server answers; assume a small file so the bar
           still moves rather than sitting at zero. */
        size: 900 * 1024,
        loaded: 0,
        status: "queued",
        source: "url",
        url: value,
      };
      setItems((list) => {
        const out = [...list, item];
        onChange?.(out);
        return out;
      });
      setUrlValue("");
      if (autoUpload) start(item);
    },
    [autoUpload, onChange, start],
  );

  const remove = React.useCallback(
    (item: UploadItem) => {
      controllers.current.get(item.id)?.abort();
      controllers.current.delete(item.id);
      if (item.preview && objectUrls.current.has(item.preview)) {
        URL.revokeObjectURL(item.preview);
        objectUrls.current.delete(item.preview);
      }
      setItems((list) => {
        const out = list.filter((i) => i.id !== item.id);
        onChange?.(out);
        return out;
      });
      onRemove?.(item);
    },
    [onChange, onRemove],
  );

  const cancelAll = React.useCallback(() => {
    latest.current
      .filter((i) => i.status === "uploading" || i.status === "queued")
      .forEach(remove);
  }, [remove]);

  /** Empty the list outright — finished rows, rejections and all. */
  const clearAll = React.useCallback(() => {
    latest.current.forEach(remove);
  }, [remove]);

  /* -- drop zone ---------------------------------------------------------- */

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    add(Array.from(e.dataTransfer.files ?? []));
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length) {
      e.preventDefault();
      add(files);
    }
  };

  /* -- what the header says ----------------------------------------------- */

  const pending = items.filter((i) => i.status === "queued");
  const sending = items.filter((i) => i.status === "uploading");
  const active = [...sending, ...pending];
  const done = items.filter((i) => i.status === "done");
  const failed = items.filter((i) => i.status === "error");
  const totalBytes = items.reduce((n, i) => n + (i.status === "error" ? 0 : i.size), 0);
  const loadedBytes = items.reduce((n, i) => n + (i.status === "error" ? 0 : i.loaded), 0);
  const overall = totalBytes ? Math.min(100, (loadedBytes / totalBytes) * 100) : 0;

  return (
    <div
      ref={ref}
      data-file-upload=""
      style={{ fontFamily: FONT_STACK }}
      className={cn(
        "w-full max-w-[480px] overflow-hidden rounded-[18px] border border-black/[0.07] bg-white text-neutral-900 antialiased dark:border-white/[0.09] dark:bg-neutral-900 dark:text-neutral-50",
        SQUIRCLE,
        className,
      )}
    >
      {/* header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3.5">
        <span
          aria-hidden
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-neutral-600 dark:text-neutral-300",
            SQUIRCLE,
            EDGE,
          )}
        >
          <UploadCloud className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
          <p className="m-0 mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-[8px] text-neutral-400 transition-colors hover:bg-black/[0.05] hover:text-neutral-700 dark:hover:bg-white/[0.08] dark:hover:text-neutral-100",
              SQUIRCLE,
              FOCUS,
            )}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="h-px w-full bg-black/[0.06] dark:bg-white/[0.08]" />

      <div className="px-4 pt-4 pb-4">
        {/* drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Choose a file or drop it here"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onPaste={onPaste}
          onDragEnter={(e) => {
            e.preventDefault();
            depth.current += 1;
            setDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            e.preventDefault();
            depth.current = Math.max(0, depth.current - 1);
            if (depth.current === 0) setDragging(false);
          }}
          onDrop={onDrop}
          className={cn(
            "relative grid cursor-pointer place-items-center rounded-[14px] border border-dashed px-6 py-7 text-center transition-colors",
            SQUIRCLE,
            FOCUS,
            dragging
              ? "border-blue-500 bg-blue-50/70 dark:border-blue-400 dark:bg-blue-500/[0.12]"
              : "border-black/[0.14] hover:border-black/[0.24] hover:bg-black/[0.015] dark:border-white/[0.16] dark:hover:border-white/[0.28] dark:hover:bg-white/[0.03]",
          )}
        >
          <motion.span
            aria-hidden
            animate={reduced ? {} : dragging ? { y: -3, scale: 1.06 } : { y: 0, scale: 1 }}
            transition={SPRING}
            className={cn(
              "mb-2.5 grid h-10 w-10 place-items-center rounded-[12px] transition-colors",
              SQUIRCLE,
              dragging
                ? "bg-blue-500 text-white"
                : "bg-neutral-100 text-neutral-500 dark:bg-white/[0.07] dark:text-neutral-300",
            )}
          >
            <UploadCloud className="h-[18px] w-[18px]" />
          </motion.span>

          <p className="m-0 text-[13px] font-medium text-neutral-900 dark:text-neutral-50">
            {dragging ? "Drop to upload" : "Choose a file or drag & drop it here"}
          </p>
          <p className="m-0 mt-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {acceptLabel(accept)} formats, up to {formatBytes(maxSize)}
          </p>

          <span
            className={cn(
              "mt-3.5 inline-flex h-8 items-center rounded-[9px] border border-black/[0.12] px-3 text-[12.5px] font-medium text-neutral-800 transition-colors hover:bg-black/[0.04] dark:border-white/[0.16] dark:text-neutral-100 dark:hover:bg-white/[0.06]",
              SQUIRCLE,
            )}
          >
            Browse file
          </span>

          <input
            ref={inputRef}
            type="file"
            hidden
            multiple={multiple}
            accept={accept.join(",")}
            onChange={(e) => {
              add(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>

        {/* the queue */}
        <AnimatePresence initial={false}>
          {items.length ? (
            <motion.div
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={reduced ? { duration: 0 } : SOFT}
              className="overflow-hidden"
            >
              {/* what the whole queue is doing, in one line */}
              <div className="flex items-center justify-between gap-3 pt-4 pb-2">
                <p className="m-0 flex items-center gap-1.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                  {sending.length ? (
                    <>
                      {done.length} of {done.length + sending.length} uploaded ·{" "}
                      {formatBytes(loadedBytes)} of {formatBytes(totalBytes)}
                    </>
                  ) : (
                    /* The bar at the foot already counts the files, so this
                       line carries what it does not: the weight. */
                    <>{formatBytes(totalBytes)} total</>
                  )}
                  {/* Failures are counted separately rather than folded into the
                      total, so "3 files" always means three files you have. */}
                  {failed.length ? (
                    <span className="text-red-600 dark:text-red-300">
                      · {failed.length} failed
                    </span>
                  ) : null}
                </p>
                {/* One slot, two jobs: stop what is running, or clear what is
                    left behind. Both are the same gesture to the user — "get
                    rid of this list" — so they share a place. */}
                <button
                  type="button"
                  onClick={sending.length ? cancelAll : clearAll}
                  className={cn(
                    "rounded-[8px] px-1.5 py-1 text-[12px] font-medium text-neutral-500 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-300",
                    FOCUS,
                  )}
                >
                  {sending.length ? "Cancel all" : "Clear all"}
                </button>
              </div>

              {/* A hairline for the queue as a whole — and like the per-row
                  bars, it only exists while it still means something. */}
              <AnimatePresence initial={false}>
                {sending.length ? (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 3, marginBottom: 10 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
                    transition={reduced ? { duration: 0 } : SOFT}
                    className="w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.1]"
                  >
                    <motion.div
                      className="h-full rounded-full bg-neutral-900 dark:bg-neutral-50"
                      animate={{ width: `${overall}%` }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* A row cut flat by the scroller reads as broken. Masking the
                  last few pixels away says "there is more" instead — and a
                  mask works over the rows themselves, which a gradient laid
                  on top of opaque rows cannot. */}
              <ul
                ref={listRef}
                onScroll={trackScroll}
                className="m-0 flex list-none flex-col gap-2 overflow-y-auto p-0 [scrollbar-width:thin]"
                style={{
                  maxHeight,
                  maskImage: spill
                    ? "linear-gradient(to bottom, #000 calc(100% - 30px), transparent)"
                    : undefined,
                  WebkitMaskImage: spill
                    ? "linear-gradient(to bottom, #000 calc(100% - 30px), transparent)"
                    : undefined,
                }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item) => (
                    <Row
                      key={item.id}
                      item={item}
                      onCancel={() => remove(item)}
                      onRetry={() => {
                        patch(item.id, { loaded: 0, error: undefined, retriable: undefined });
                        start({ ...item, loaded: 0 });
                      }}
                      onRemove={() => remove(item)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* import from a link */}
        {allowUrlImport ? (
          <>
            <div className="flex items-center gap-3 py-4">
              <span className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.08]" />
              <span className="text-[11px] font-medium tracking-[0.06em] text-neutral-400 uppercase">
                or
              </span>
              <span className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.08]" />
            </div>

            <label
              htmlFor="file-upload-url"
              className="m-0 block text-[12.5px] font-medium text-neutral-700 dark:text-neutral-200"
            >
              Import from link
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-black/[0.12] px-2.5 transition-colors focus-within:border-neutral-400 dark:border-white/[0.14] dark:focus-within:border-white/[0.3]",
                  SQUIRCLE,
                )}
              >
                <Link2 aria-hidden className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                <input
                  id="file-upload-url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addUrl(urlValue);
                    }
                  }}
                  placeholder="Paste a file URL"
                  className="m-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-[12.5px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-50"
                />
              </div>
              <button
                type="button"
                onClick={() => addUrl(urlValue)}
                disabled={!urlValue.trim()}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-[10px] px-3 text-[12.5px] font-medium transition-colors",
                  urlValue.trim()
                    ? "bg-neutral-900 text-white hover:opacity-90 dark:bg-neutral-50 dark:text-neutral-900"
                    : "pointer-events-none bg-black/[0.06] text-neutral-400 dark:bg-white/[0.09] dark:text-neutral-500",
                  SQUIRCLE,
                  FOCUS,
                )}
              >
                Import
              </button>
            </div>
          </>
        ) : null}

        {footer ? <div className="pt-4">{footer}</div> : null}
      </div>

      {/* The bar the whole thing is aiming at.
          Its label is the state of the queue, so the user never has to work
          out whether pressing it will start something or finish it: files
          waiting says "Upload 3 files", files in flight says "Uploading",
          and a settled queue offers the one that hands them over. */}
      {showActions && !footer ? (
        <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] px-4 py-3 dark:border-white/[0.08]">
          <p className="m-0 min-w-0 truncate text-[12px] text-neutral-500 dark:text-neutral-400">
            {pending.length
              ? `${pending.length} file${pending.length > 1 ? "s" : ""} ready`
              : sending.length
                ? `${sending.length} uploading`
                : done.length
                  ? `${done.length} file${done.length > 1 ? "s" : ""} attached`
                  : "No files selected yet"}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "inline-flex h-9 items-center rounded-[10px] border border-black/[0.12] px-3 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.04] dark:border-white/[0.16] dark:text-neutral-200 dark:hover:bg-white/[0.06]",
                  SQUIRCLE,
                  FOCUS,
                )}
              >
                Cancel
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (pending.length) return pending.forEach(start);
                onSubmit?.(latest.current.filter((i) => i.status === "done"));
                onClose?.();
              }}
              disabled={!pending.length && !done.length}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3.5 text-[12.5px] font-medium transition-colors",
                SQUIRCLE,
                FOCUS,
                sending.length || (!pending.length && !done.length)
                  ? "pointer-events-none bg-black/[0.06] text-neutral-400 dark:bg-white/[0.09] dark:text-neutral-500"
                  : "bg-neutral-900 text-white hover:opacity-90 dark:bg-neutral-50 dark:text-neutral-900",
              )}
            >
              {sending.length ? (
                <>
                  <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
                  Uploading
                </>
              ) : pending.length ? (
                `Upload ${pending.length} file${pending.length > 1 ? "s" : ""}`
              ) : (
                (submitLabel ?? "Attach files")
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
});

/* -------------------------------------------------------------------------- */

export type FileUploadDialogProps = FileUploadProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * The same panel, as a modal.
 *
 * It portals to the body so no ancestor's overflow or stacking context can
 * clip it, restores focus to whatever opened it, and — the part that is
 * usually missed — it does not close on a drop. Dragging a file over a modal
 * is an outside pointer event as far as most dismiss handlers are concerned,
 * which is how a backdrop-click handler eats the file you just dropped.
 */
export function FileUploadDialog({ open, onOpenChange, ...props }: FileUploadDialogProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const opener = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
      opener.current?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4"
          style={{ fontFamily: FONT_STACK }}
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-neutral-950/35 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={props.title ?? "Upload files"}
            initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.985 }}
            transition={reduced ? { duration: 0 } : SPRING}
            className="relative w-full max-w-[480px]"
          >
            <FileUpload
              {...props}
              onClose={() => onOpenChange(false)}
              className={cn(
                "shadow-[0_32px_70px_-20px_rgb(0_0_0/0.35)]",
                props.className,
              )}
            />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default FileUpload;

export { FileUpload as Component };
