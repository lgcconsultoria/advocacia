"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/contact-16-utils/input";

export default function Contact16() {
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-6 sm:px-10">
        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-foreground/5">
              <CheckCircle2 className="size-6 text-foreground" />
            </span>
            <h2 className="font-semibold text-2xl tracking-tight">
              Message received
            </h2>
            <p className="text-muted-foreground">
              We&apos;ll reply within one business day.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 text-center">
              <h2 className="font-semibold text-3xl tracking-tight sm:text-4xl">
                Get in touch
              </h2>
              <p className="text-muted-foreground">
                Questions, feedback, or partnership inquiries — we read
                everything.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="c16-name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <Input
                  id="c16-name"
                  placeholder="Ada Lovelace"
                  required
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="c16-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="c16-email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="c16-msg"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="c16-msg"
                  rows={5}
                  required
                  placeholder="How can we help?"
                  className="flex w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-foreground/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full rounded-full"
              >
                Send message
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
