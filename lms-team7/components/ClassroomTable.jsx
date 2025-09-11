// components/ClassroomTable.jsx
export default function ClassroomTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto border rounded-2xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Course</Th><Th>Lesson</Th><Th>Student</Th><Th>Teacher</Th><Th>Start</Th><Th>Duration</Th><Th>Grade</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t">
              <Td>{r.course}</Td>
              <Td>{r.lesson}</Td>
              <Td>{r.student}</Td>
              <Td>{r.teacher}</Td>
              <Td>{r.startDate}</Td>
              <Td>{r.durationWeeks}</Td>
              <Td>{r.grade}</Td>
              <Td><button className="px-2 py-1 rounded-lg border">Edit</button></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) { return <th className="text-left px-3 py-2">{children}</th>; }
function Td({ children }) { return <td className="px-3 py-2">{children}</td>; }
