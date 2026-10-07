"use client";

import * as React from "react";
import {
  CompareSlider,
  CompareSliderAfter,
  CompareSliderBefore,
  CompareSliderHandle,
} from "@/components/ui/compare-slider";

export default function CompareSliderControlledDemo() {
  const [value, setValue] = React.useState(30);

  return (
    <CompareSlider
      value={value}
      onValueChange={setValue}
      className="h-[400px] overflow-hidden rounded-lg border"
    >
      <CompareSliderBefore label="Original">
        <img
          src="https://cdn.21st.dev/assets/mirror/1c/1ca0aa34f2bd8e8a679771715d3a458726eb7e4d536da171a97966bad0e8aa2b.webp"
          alt="Original"
          className="size-full object-cover"
        />
      </CompareSliderBefore>
      <CompareSliderAfter label="Enhanced">
        <img
          src="https://cdn.21st.dev/assets/mirror/2b/2beab0b1f179058626d69c8faef7109c8c908d0379c5e0970ebee84f86cf814c.webp"
          alt="Enhanced"
          className="size-full object-cover"
        />
      </CompareSliderAfter>
      <CompareSliderHandle />
    </CompareSlider>
  );
}
