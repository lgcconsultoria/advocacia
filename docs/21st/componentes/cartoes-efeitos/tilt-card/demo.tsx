"use client";

import { TiltCard } from "@/components/ui/tilt-card";

function Demo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-8">
      <TiltCard
        effect="gravitate"
        tiltLimit={18}
        className="w-[360px] rounded-[2rem] border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-2xl"
      >
        <div className="relative z-20">
          <p className="text-sm text-white/60">Effect</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">Gravitate</h3>
          <div className="mt-20 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-2xl bg-white/10" />
            <div className="h-20 rounded-2xl bg-white/15" />
            <div className="h-20 rounded-2xl bg-white/10" />
          </div>
        </div>
      </TiltCard>
    </div>
  );
}


export default { Demo };
