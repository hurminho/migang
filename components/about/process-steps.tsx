import { Reveal } from "@/components/ui/reveal";

interface ProcessStepsProps {
  steps: string[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <Reveal
      as="ol"
      className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-3 xl:grid-cols-6"
    >
      {steps.map((step, i) => (
        <li key={`${step}-${i}`} className="flex min-h-40 flex-col justify-between bg-white p-6">
          <span className="text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
          <p className="text-lg leading-snug font-semibold">{step}</p>
        </li>
      ))}
    </Reveal>
  );
}
