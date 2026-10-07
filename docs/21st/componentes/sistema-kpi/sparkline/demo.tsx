import {
  Sparkline,
  SparklineChart,
  SparklineValue,
  SparklineLabel,
} from "@/components/ui/sparkline";

export default function SparklineStat() {
  return (
    <Sparkline
      data={[198_120, 201_540, 199_880, 205_300, 208_770, 214_260, 222_240]}
      labels={[
        "Nov 11",
        "Nov 12",
        "Nov 13",
        "Nov 14",
        "Nov 15",
        "Nov 16",
        "Nov 17",
      ]}
      className="w-72 max-w-full"
    >
      <SparklineLabel />
      <SparklineValue className="text-2xl" />
      <SparklineChart
        fill
        height={56}
        tooltip
        aria-label="Active users this week"
      />
    </Sparkline>
  );
}
