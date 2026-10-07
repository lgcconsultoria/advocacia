"use client";

import * as React from "react";
import { ScrollLinkedVideoScrubber } from "@/components/ui/scroll-linked-video-scrubber";

export default function VideoScrubberDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl">
        <div
          ref={containerRef}
          className="h-96 overflow-y-auto rounded-xl border border-border"
        >
          <ScrollLinkedVideoScrubber
            src="https://cdn.21st.dev/assets/mirror/d7/d7ee23a7ea14e6f11b98ea22d61c3bda485dac95272b877509369e637e151791.mp4"
            poster="https://cdn.21st.dev/assets/mirror/fd/fd47d62e09f9b66f32f6cff48ce30b609220525ba3ebb7f3069d2beed4e94cf6.jpg"
            scroller={containerRef}
            scrollHeight="500%"
          />
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Scroll inside the frame to scrub the video timeline
        </p>
      </div>
    </div>
  );
}
