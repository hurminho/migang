const departments = [
  "Construtors",
  "Contrators",
  "Buyers",
  "Officers",
] as const;

interface OrgChartProps {
  ceoName?: string;
}

export function OrgChart({ ceoName }: OrgChartProps) {
  return (
    <section>
      <p className="mb-4 text-xs tracking-[0.08em] text-muted uppercase">Organization</p>
      <div className="text-sm">
        <div>
          <p className="font-medium">CEO</p>
          {ceoName && <p className="mt-0.5 text-muted">{ceoName}</p>}
        </div>
        <ul className="mt-4 space-y-2 border-l border-border pl-4">
          {departments.map((role) => (
            <li key={role} className="text-muted">
              {role}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
