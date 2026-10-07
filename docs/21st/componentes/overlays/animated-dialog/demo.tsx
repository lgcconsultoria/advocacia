import {
  AnimatedDialog,
  AnimatedDialogTrigger,
  AnimatedDialogContent,
  AnimatedDialogHeader,
  AnimatedDialogBody,
  AnimatedDialogFooter,
  AnimatedDialogTitle,
  AnimatedDialogDescription,
  AnimatedDialogClose,
} from "@/components/ui/animated-dialog";

export default function AnimatedDialogDemo() {
  return (
    // mobileVariant="sheet" (default) → centered modal on desktop, bottom sheet on mobile.
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-8">
      <AnimatedDialog mobileVariant="sheet">
        <AnimatedDialogTrigger asChild>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Edit profile
          </button>
        </AnimatedDialogTrigger>
        <AnimatedDialogContent>
          <AnimatedDialogHeader>
            <AnimatedDialogTitle>Edit profile</AnimatedDialogTitle>
            <AnimatedDialogDescription>
              Header + footer stay pinned.
            </AnimatedDialogDescription>
          </AnimatedDialogHeader>
          <AnimatedDialogBody>
            <p className="text-sm text-[var(--color-fg,#111318)]/70">
              This is the only scroll region — the header and footer above and
              below stay fixed in place while long content scrolls here.
            </p>
          </AnimatedDialogBody>
          <AnimatedDialogFooter>
            <AnimatedDialogClose asChild>
              <button className="rounded-lg border border-[var(--color-border,#e4e7ec)] px-4 py-2 text-sm font-medium">
                Cancel
              </button>
            </AnimatedDialogClose>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Save
            </button>
          </AnimatedDialogFooter>
        </AnimatedDialogContent>
      </AnimatedDialog>
    </div>
  );
}
