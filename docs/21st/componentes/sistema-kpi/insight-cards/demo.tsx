import InsightCards, { type Insight } from "@/components/ui/insight-cards";

export default function InsightCardsDemo() {
  const insights: Insight[] = [
    {
      id: "revenue",
      label: "Revenue",
      value: "$48.2k",
      change: 12.4,
      spark: [30, 45, 40, 60, 55, 70, 90],
      note: "Revenue growth is accelerating week over week.",
    },
    {
      id: "churn",
      label: "Churn Rate",
      value: "2.1%",
      change: -3.2,
      spark: [70, 60, 65, 50, 45, 40, 35],
      note: "Churn continues to trend down after the pricing update.",
    },
    {
      id: "active-users",
      label: "Active Users",
      value: "12,480",
      change: 5.6,
      spark: [40, 42, 44, 43, 48, 50, 55],
    },
    {
      id: "nps",
      label: "NPS Score",
      value: "64",
      change: 1.8,
      spark: [58, 59, 60, 61, 62, 63, 64],
    },
  ];

  return (
    <div className="flex w-full items-center justify-center p-6">
      <InsightCards insights={insights} variant="Grid" />
    </div>
  );
}
