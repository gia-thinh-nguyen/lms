export default function ClassroomTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto text-[var(--color-text)]">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[color-mix(in_srgb,var(--color-text)_15%,transparent)]">
          <tr>
            <Th>Course</Th>
            <Th>Lesson</Th>
            <Th>Student</Th>
            <Th>Teacher</Th>
            <Th>Start</Th>
            <Th>Duration</Th>
            <Th>Grade</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-b last:border-b-0 border-[color-mix(in_srgb,var(--color-text)_10%,transparent)]">
              <Td>{r.course}</Td>
              <Td>{r.lesson}</Td>
              <Td>{r.student}</Td>
              <Td>{r.teacher}</Td>
              <Td>{r.startDate}</Td>
              <Td>{r.durationWeeks}</Td>
              <Td>{r.grade}</Td>
              <Td><button className="primary">Edit</button></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) { return <th className="text-left px-3 py-2 font-semibold text-[var(--color-text)]">{children}</th>; }
function Td({ children }) { return <td className="px-3 py-2 text-[var(--color-text)]">{children}</td>; }
