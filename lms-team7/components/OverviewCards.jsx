export default function OverviewCards({ courses, lessons, students }) {
  const items = [
    { label: "Courses",  value: courses },
    { label: "Lessons",  value: lessons },
    { label: "Students", value: students },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((i) => (
        <div key={i.label} className="card p-5">
          <p className="text-sm text-[var(--color-muted)]">{i.label}</p>
          <p className="text-3xl font-bold text-[var(--color-text)]">{i.value}</p>
        </div>
      ))}
    </div>
  );
}
