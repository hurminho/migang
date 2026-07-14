interface ProcessStepsProps {
  steps: string[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <section>
      <p className="mb-8 text-xs tracking-[0.08em] text-muted uppercase">Process</p>

      {/* Mobile & tablet: vertical timeline */}
      <ol className="relative space-y-0 lg:hidden">
        {steps.map((step, i) => (
          <li key={`${step}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-border"
                aria-hidden
              />
            )}
            <span className="relative z-10 flex size-8 shrink-0 items-center justify-center bg-white text-xs tabular-nums ring-1 ring-border">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="pt-1.5 text-sm text-muted">{step}</p>
          </li>
        ))}
      </ol>

      {/* Desktop: horizontal flow */}
      <ol className="hidden lg:flex lg:items-start lg:justify-between">
        {steps.map((step, i) => (
          <li key={`${step}-${i}`} className="relative flex flex-1 flex-col items-center px-2">
            {i > 0 && (
              <span
                className="absolute right-1/2 top-4 h-px w-full bg-border"
                aria-hidden
              />
            )}
            <span className="relative z-10 flex size-8 items-center justify-center bg-white text-xs tabular-nums ring-1 ring-border">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 text-center text-sm leading-snug text-muted">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
