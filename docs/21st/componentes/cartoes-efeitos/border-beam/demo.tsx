import BorderBeam from "@/components/ui/border-beam";

const settings = {
  colorFrom: "#ffaa40",
  colorTo: "#9c40ff",
  size: 200,
  anchor: 90,
  borderWidth: 1.5,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="relative h-64 w-96 overflow-hidden rounded-xl border bg-background">
        <BorderBeam
          colorFrom={s.colorFrom}
          colorTo={s.colorTo}
          size={s.size}
          anchor={s.anchor}
          borderWidth={s.borderWidth}
        />
      </div>
    </div>
  );
}
