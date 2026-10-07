"use client";

import { RollingDigits } from "@/components/ui/rolling-digits";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RollingDigitsDemo() {
  const [value, setValue] = useState(12345);

  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-8 p-8 text-foreground">
      <RollingDigits
        value={value}
        startOnView={false}
        className="text-7xl font-semibold tracking-tight"
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 137))}
        >
          -137
        </Button>
        <Button variant="outline" onClick={() => setValue((v) => v + 137)}>
          +137
        </Button>
        <Button
          variant="outline"
          onClick={() => setValue(Math.floor(Math.random() * 100000))}
        >
          Randomize
        </Button>
      </div>
    </div>
  );
}
