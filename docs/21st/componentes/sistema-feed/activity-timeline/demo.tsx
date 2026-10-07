"use client";

import Timeline from "@/components/ui/timeline";

const now = Date.now();

const events = [
  {
    id: "1",
    at: now - 5 * 60_000,
    actor: "Mia Chen",
    title: "merged Checkout redesign into main",
    meta: "PR #482",
    avatar: "https://cdn.21st.dev/assets/mirror/b3/b36ca9959c3ac97d0eb9be717a26d714fb6133f1c9fa07b1cef6118ecc97e40e.jpg",
  },
  {
    id: "2",
    at: now - 45 * 60_000,
    title: "deployed to production",
    meta: "build #1091",
    tone: "success" as const,
  },
  {
    id: "3",
    at: now - 3 * 60 * 60_000,
    actor: "Priya Patel",
    title: "opened a new issue",
    meta: "Dark mode flicker on load",
    detail:
      "Steps to reproduce: toggle theme twice quickly on the settings page.",
    avatar: "https://cdn.21st.dev/assets/mirror/3b/3b0a3ee40a55d8217002ce43ee42ad7f55fff9d0f8d571cd699a260387638025.jpg",
  },
  {
    id: "4",
    at: now - 26 * 60 * 60_000,
    title: "build failed",
    meta: "build #1090",
    tone: "danger" as const,
  },
];

export default function TimelineDemo() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        events={events}
        now={now}
        label="Project activity"
        maxHeight={420}
      />
    </div>
  );
}
