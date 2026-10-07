"use client";

import { LogoMarquee } from "@/components/ui/logo-marquee";

const CUSTOMERS = [
  { id: "atlas", label: "Atlas", href: "/customers/atlas" },
  { id: "meridian", label: "Meridian", href: "/customers/meridian" },
  { id: "kelvin", label: "Kelvin", href: "/customers/kelvin" },
  { id: "northbeam", label: "Northbeam", href: "/customers/northbeam" },
  { id: "orbit", label: "Orbit", href: "/customers/orbit" },
];

export default function TrustedBy() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-14">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
        Trusted by
      </p>

      <LogoMarquee
        items={CUSTOMERS}
        label="Customers"
        speed={38}
        gap={44}
        direction="left"
      />
    </section>
  );
}
