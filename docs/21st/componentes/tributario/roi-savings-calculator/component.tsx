"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { FancyButton } from "@/components/fancy-button";

const animVariant: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)", scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      delay: i * 0.03,
      type: "spring",
      damping: 22,
      stiffness: 280,
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    scale: 0.98,
    transition: { duration: 0.14 },
  },
};

type SliderPatternProps = {
  value: number;
  setValue: (val: number) => void;
};

export function Pricing() {
  const [weeklyReports, setWeeklyReports] = useState(10);
  const [costPerReport, setCostPerReport] = useState(150);

  const monthlyReports = weeklyReports * 4;
  const monthlyValueSaved = monthlyReports * costPerReport;
  const platformCost = 299;
  const totalRoi = Math.max(0, monthlyValueSaved - platformCost);

  const roiChars = String(totalRoi).split("");

  return (
    <section
      aria-label="Pricing"
      className="mx-auto flex w-full max-w-5xl flex-col gap-10"
    >
      <div className="flex flex-col items-start gap-4">
        <Badge variant="secondary" className="h-7 px-3 text-primary">
          Calculate your ROI
        </Badge>
        <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          See what you save
        </h2>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-4xl bg-card p-1 shadow-elevated-lg lg:flex-row">
        <div className="flex flex-1 flex-col gap-12 p-8 lg:p-10">
          <div className="flex flex-col gap-10">
            <p className="text-lg leading-relaxed text-muted-foreground">
              How many complex data reports is your team compiling manually
              every single week?
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-center gap-2 text-5xl font-bold tracking-tight text-foreground">
                <span>{weeklyReports}</span>
                <span>reports</span>
              </div>
              <SliderPattern
                value={weeklyReports}
                setValue={setWeeklyReports}
              />
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base font-medium text-foreground">
              Average cost to produce one report?
            </p>
            <InputGroup className="h-11 w-fit">
              <InputGroupAddon>
                <InputGroupText className="font-medium text-muted-foreground">
                  $
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                value={costPerReport}
                onChange={(e) => setCostPerReport(Number(e.target.value) || 0)}
                min={0}
                aria-label="Average cost per report"
                className="w-16 text-lg font-bold tracking-tight"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="text-sm font-medium text-muted-foreground">
                  /ea
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-8 rounded-3xl bg-muted p-8 lg:w-105 lg:p-10">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h3 className="font-medium tracking-tight text-foreground">
              Automated Monthly ROI
            </h3>
            <div className="mt-2 flex items-baseline gap-1 text-7xl font-bold tracking-tight text-foreground">
              <span>$</span>
              <AnimatePresence mode="popLayout">
                {roiChars.map((char, idx) => (
                  <motion.span
                    key={`${totalRoi}-${idx}`}
                    variants={animVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={idx}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Net savings with a DataSync enterprise plan
            </p>
            <FancyButton
              size="lg"
              className="mt-6 w-full text-base font-medium"
            >
              Start your free trial
            </FancyButton>
          </div>

          <div className="flex w-full flex-col gap-3 text-sm">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Breakdown
            </p>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Reports automated monthly
              </span>
              <span className="font-medium text-foreground">
                {monthlyReports}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Capital preserved</span>
              <span className="font-medium text-foreground">
                ${monthlyValueSaved}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                DataSync platform fee
              </span>
              <span className="font-medium text-foreground">
                ${platformCost}
              </span>
            </div>
            <div className="-mx-2 my-1 h-px bg-border/50" />
            <div className="flex items-center justify-between font-semibold">
              <span className="text-foreground">Total monthly ROI</span>
              <span className="text-foreground">${totalRoi}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderPattern({ value, setValue }: SliderPatternProps) {
  const max = 20;
  const skipInterval = 5;
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="mx-auto grid w-full gap-4">
      <Slider
        value={[value]}
        onValueChange={(val) =>
          setValue(Array.isArray(val) ? (val[0] ?? 0) : val)
        }
        max={max}
        min={0}
        step={1}
        className="cursor-grab active:cursor-grabbing **:data-[slot=slider-thumb]:h-6 **:data-[slot=slider-thumb]:w-6 **:data-[slot=slider-thumb]:border-4 **:data-[slot=slider-thumb]:border-solid **:data-[slot=slider-thumb]:border-card **:data-[slot=slider-thumb]:bg-primary **:data-[slot=slider-thumb]:ring-0 **:data-[slot=slider-thumb]:hover:ring-0 **:data-[slot=slider-thumb]:focus-visible:ring-0 **:data-[slot=slider-thumb]:active:ring-0 **:data-[slot=slider-track]:h-2.5 **:data-[slot=slider-track]:bg-input/60"
      />
      <span
        aria-hidden="true"
        className="flex w-full items-center justify-between gap-1 px-3 text-xs font-medium text-muted-foreground"
      >
        {ticks.map((tick) => (
          <span
            key={tick}
            className="flex w-0 flex-col items-center justify-center gap-2"
          >
            <span
              className={cn(
                "w-px bg-muted-foreground/30",
                tick % skipInterval === 0 ? "h-2" : "h-1",
              )}
            />
            <span
              className={cn(
                "text-muted-foreground/70",
                tick % skipInterval !== 0 && "opacity-0",
              )}
            >
              {tick}
              {tick === max && "+"}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
export default Pricing;
