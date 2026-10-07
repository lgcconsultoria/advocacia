import TextMorphing from "@/components/ui/text-morphing";

export default function TextMorphingDemo() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <TextMorphing
        texts={["Design", "Develop", "Deploy", "Delight"]}
        className="text-foreground"
      />
    </div>
  );
}
