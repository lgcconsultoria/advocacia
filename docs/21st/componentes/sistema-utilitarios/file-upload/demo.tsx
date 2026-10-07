import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, Paperclip, UploadCloud } from "lucide-react";
import {
  FileUploadDialog,
  formatBytes,
  simulateUpload,
  type UploadItem,
  type Uploader,
} from "@/components/ui/file-upload";

/* A transport that behaves like a real one: it moves at a plausible rate and
   it fails sometimes, so the error and retry paths are visible in the demo
   rather than only in the props table. */
const flakyUpload: Uploader = async (item, ctx) => {
  await simulateUpload(item, ctx);
  if (/report/i.test(item.name)) throw new Error("Network error — the connection dropped");
  return {};
};

export default function FileUploadDemo() {
  const [open, setOpen] = React.useState(false);
  const [attached, setAttached] = React.useState<UploadItem[]>([]);

  return (
    <div className="w-full bg-background px-10 py-10">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-5">
        {/* the form the files belong to */}
        <div className="w-full max-w-[520px] rounded-[18px] border border-black/[0.07] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05)] [corner-shape:squircle] dark:border-white/[0.08] dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-neutral-100 text-neutral-500 [corner-shape:squircle] dark:bg-white/[0.07] dark:text-neutral-300">
              <Briefcase aria-hidden className="h-4 w-4" />
            </span>
            <div>
              <p className="m-0 text-[13.5px] font-medium text-neutral-900 dark:text-neutral-50">
                Senior Product Designer
              </p>
              <p className="m-0 text-[11.5px] text-neutral-500 dark:text-neutral-400">
                Northwind Studio · Remote, Europe
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-white/[0.06]" />
            <div className="h-2 w-[92%] rounded-full bg-neutral-100 dark:bg-white/[0.06]" />
            <div className="h-2 w-[74%] rounded-full bg-neutral-100 dark:bg-white/[0.06]" />
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* what came back from the dialog lands here */}
              <div className="flex min-h-[54px] flex-col justify-end gap-1.5 pb-2">
                {attached.map((file) => (
                  <motion.p
                    key={file.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="m-0 flex items-center gap-1.5 truncate text-[12px] text-neutral-700 dark:text-neutral-200"
                  >
                    <Paperclip aria-hidden className="h-3 w-3 shrink-0 text-neutral-400" />
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-neutral-400">{formatBytes(file.size)}</span>
                  </motion.p>
                ))}
              </div>
              <div className="h-px w-full bg-black/[0.14] dark:bg-white/20" />
              <p className="m-0 mt-1.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">
                {attached.length
                  ? `${attached.length} attachment${attached.length > 1 ? "s" : ""}`
                  : "CV, portfolio and anything else worth seeing"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] bg-neutral-900 px-3.5 text-[13px] font-medium text-white transition-colors [corner-shape:squircle] hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-white"
            >
              <UploadCloud aria-hidden className="h-3.5 w-3.5" />
              {attached.length ? "Add more" : "Upload files"}
            </button>
          </div>
        </div>
      </div>

      <FileUploadDialog
        open={open}
        onOpenChange={setOpen}
        accept={[".pdf", ".png", ".jpg", ".csv", ".mp4"]}
        maxSize={50 * 1024 * 1024}
        uploader={flakyUpload}
        submitLabel="Attach files"
        maxHeight={200}
        onSubmit={(done) => setAttached(done)}
      />
    </div>
  );
}
