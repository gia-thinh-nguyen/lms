export default function CourseTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto text-[var(--color-text)]">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[color-mix(in_srgb,var(--color-text)_15%,transparent)]">
            <Th>Course ID</Th>
            <Th>Title</Th>
            <Th>Director</Th>
            <Th>Status</Th>
            <Th>Lessons</Th>
            <Th>Enrolled</Th>
            <Th>Total Credits</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0 border-[color-mix(in_srgb,var(--color-text)_10%,transparent)]">
              <Td className="font-medium">{r.id}</Td>
              <Td>{r.title}</Td>
              <Td>{r.director}</Td>
              <Td>{r.status}</Td>
              <Td>{r.lessons}</Td>
              <Td>{r.enrolledStudents}</Td>
              <Td>{r.totalCredits}</Td>
              <Td>
                <button className="primary">Assign Director</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return <th className="py-2 pr-4 font-semibold text-[var(--color-text)]">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`py-2 pr-4 text-[var(--color-text)] ${className}`}>{children}</td>;
}
