const departments = [
  { role: "Construtors", members: ["Choi Byeong-soo", "Choi Yun-hwan"] },
  { role: "Contrators", members: ["Bae Gee-hyun"] },
  { role: "Buyers", members: ["Choi Eun-sin"] },
  { role: "Officers", members: ["Hur Min", "Eunice Park"] },
] as const;

interface OrgChartProps {
  ceoName?: string;
}

export function OrgChart({ ceoName }: OrgChartProps) {
  return (
    <div>
      <div className="bg-ink p-6 text-white md:p-8">
        <p className="eyebrow text-white/50">CEO</p>
        {ceoName && <p className="mt-3 text-xl font-semibold">{ceoName}</p>}
      </div>
      <ul className="grid grid-cols-2 gap-px border-x border-b border-border bg-border md:grid-cols-4">
        {departments.map(({ role, members }) => (
          <li key={role} className="bg-white p-6">
            <p className="eyebrow">{role}</p>
            <ul className="mt-3 space-y-1">
              {members.map((member) => (
                <li key={member} className="text-base">
                  {member}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
