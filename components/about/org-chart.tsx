const departments = [
  { role: "Construtors", members: ["Choi, Byeong-soo", "|", "Choi, Yun-hwan"] },
  { role: "Contrators", members: ["Bae, Gee-hyun"] },
  { role: "Buyers", members: ["Choi, Eun-sin"] },
  { role: "Officers", members: ["Hur, Min", "|", "Eunice Park"] },
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
        <ul className="mt-4 space-y-3 border-l border-border pl-4">
          {departments.map(({ role, members }) => (
            <li key={role}>
              <p className="font-medium">{role}</p>
              <p className="mt-0.5 text-muted">{members.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
