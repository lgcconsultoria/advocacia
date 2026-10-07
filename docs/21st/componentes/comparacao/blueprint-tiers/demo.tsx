import BlueprintTiers from "@/components/ui/blueprint-tiers";
import type { Plan } from "@/components/ui/blueprint-tiers-utils/types";

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo builders shipping a first project.",
    price: { monthly: 0, annual: 0 },
    cta: "Get started",
    features: ["1 workspace", "Community support", "Basic analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing teams that need more room to build.",
    price: { monthly: 29, annual: 24 },
    cta: "Start free trial",
    featured: true,
    badge: "Popular",
    features: [
      "5 workspaces",
      "Priority support",
      "Advanced analytics",
      "Custom domains",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For organizations running at production scale.",
    price: { monthly: 79, annual: 65 },
    cta: "Talk to sales",
    features: [
      "Unlimited workspaces",
      "Dedicated support",
      "SSO & audit logs",
      "Custom SLAs",
    ],
  },
];

export default function BlueprintTiersDemo() {
  return (
    <BlueprintTiers
      eyebrow="Simple and transparent"
      heading="Pricing that scales with your build"
      subheading="Start free, upgrade when you need more power."
      plans={plans}
    />
  );
}
