"use client";

import Slider from "@/components/ui/slider";
import { useState } from "react";

// Set the ends of the scale with min and max.
export default function SliderRangeDemo() {
  const [cap, setCap] = useState(200);
  return (
    <div style={{ width: 320 }}>
      <Slider
        label="Refund cap (USD)"
        min={50}
        max={500}
        value={cap}
        onChange={setCap}
      />
    </div>
  );
}
