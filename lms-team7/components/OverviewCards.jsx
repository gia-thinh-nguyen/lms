// components/OverviewCards.jsx
export default function OverviewCards({ courses, lessons, students }) {
  const items = [
    { label: "Courses", value: courses },
    { label: "Lessons", value: lessons },
    { label: "Students", value: students },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((i) => (
        <div key={i.label} className="p-5 rounded-xl bg-blue-50 shadow">
          <p className="text-sm text-gray-600">{i.label}</p>
          <p className="text-3xl font-bold">{i.value}</p>
        </div>
      ))}
    </div>
  );
}
