"use client"

import { PrismHero } from "@/components/ui/prism-hero"

export default function PrismHeroDemo() {
  return (
    <PrismHero
      eyebrow="Bevel UI"
      headline="Refraction"
      description="A faceted crystal with real transmission and chromatic dispersion, refracting the headline behind it. No models, no HDRI, no external assets."
      meta={["Procedural geometry", "Real transmission", "Zero assets"]}
      action={
        <a
          href="#"
          className="inline-flex h-11 items-center rounded-full bg-[#EDE8DF] px-7 font-mono text-[11px] uppercase tracking-[0.18em] text-[#08080B] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Get started
        </a>
      }
      secondaryAction={
        <a
          href="#"
          className="inline-flex h-11 items-center rounded-full border border-[#EDE8DF3d] px-7 font-mono text-[11px] uppercase tracking-[0.18em] text-[#EDE8DF] transition-colors duration-300 hover:bg-white/5"
        >
          Documentation
        </a>
      }
    />
  )
}
