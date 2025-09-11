// components/CourseTable.jsx
export default function CourseTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2 pr-4">Course ID</th>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Director</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Lessons</th>
            <th className="py-2 pr-4">Enrolled</th>
            <th className="py-2 pr-4">Total Credits</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0">
              <td className="py-2 pr-4 font-medium">{r.id}</td>
              <td className="py-2 pr-4">{r.title}</td>
              <td className="py-2 pr-4">{r.director}</td>
              <td className="py-2 pr-4">{r.status}</td>
              <td className="py-2 pr-4">{r.lessons}</td>
              <td className="py-2 pr-4">{r.enrolledStudents}</td>
              <td className="py-2 pr-4">{r.totalCredits}</td>
              <td className="py-2">
                <button className="px-3 py-1 rounded-lg border">Assign Director</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
