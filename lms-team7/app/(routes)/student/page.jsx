import { checkTeacher } from "@/utils/checkTeacher";
import { UserCircle, LogOut } from "lucide-react";
import UnitPieChart from "@/components/UnitPieChart"; //client pie-chart component exported

export default function Page() {
  const student = {
    name: "Saketh Vinukonda",
    avatar: "/avatar.png",
    year: "Year 1",
    semester: "Semester 1",
    totalCredits: 0,
    requiredCredits: 24,
    units: [
      // Completed
      {
        id: "ENG101",
        name: "Engineering Mathematics",
        coordinator: "Dr. Smith",
        credits: 6,
        assessments: [
          { id: "A1", title: "Assignment 1", type: "assignment", status: "Completed", weight: 25 },
          { id: "A2", title: "Assignment 2", type: "assignment", status: "Completed", weight: 25 },
          { id: "EX", title: "Final Exam", type: "exam", status: "Completed", weight: 50 },
        ],
        weeks: 12,
      },
      // 50% done
      {
        id: "ENG102",
        name: "Mechanics",
        coordinator: "Prof. Lee",
        credits: 6,
        assessments: [
          { id: "A1", title: "Assignment 1", type: "assignment", status: "Completed", weight: 25 },
          { id: "A2", title: "Assignment 2", type: "assignment", status: "In Progress", weight: 25 },
          { id: "EX", title: "Final Exam", type: "exam", status: "In Progress", weight: 50 },
        ],
        weeks: 12,
      },
      // 25% done
      {
        id: "ENG103",
        name: "Electrical Systems",
        coordinator: "Dr. Patel",
        credits: 6,
        assessments: [
          { id: "A1", title: "Assignment 1", type: "assignment", status: "Completed", weight: 25 },
          { id: "A2", title: "Assignment 2", type: "assignment", status: "Not Started", weight: 25 },
          { id: "EX", title: "Final Exam", type: "exam", status: "Not Started", weight: 50 },
        ],
        weeks: 12,
      },
      // Not started
      {
        id: "ENG104",
        name: "Materials Engineering",
        coordinator: "Prof. Nguyen",
        credits: 6,
        assessments: [
          { id: "A1", title: "Assignment 1", type: "assignment", status: "Not Started", weight: 25 },
          { id: "A2", title: "Assignment 2", type: "assignment", status: "Not Started", weight: 25 },
          { id: "EX", title: "Final Exam", type: "exam", status: "Not Started", weight: 50 },
        ],
        weeks: 12,
      },
    ],
  };

  // Calculate credits (only if all assessments are completed)
  const calculateCredits = (unit) => {
    const allCompleted = unit.assessments.every((a) => a.status === "Completed");
    return allCompleted ? unit.credits : 0;
  };

  student.totalCredits = student.units.reduce(
    (sum, unit) => sum + calculateCredits(unit),
    0
  );

  // Prepare pie chart data (completed percentage of each unit)
  const pieData = student.units.map((unit) => {
    const completedWeight = unit.assessments
      .filter((a) => a.status === "Completed")
      .reduce((sum, a) => sum + a.weight, 0);
    return { name: unit.name, value: completedWeight };
  });

  return (
    <div className="min-h-screen bg-white p-6 text-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-4 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold">
          Welcome, {student.name} ({student.year} {student.semester})
        </h1>
        <div className="flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-blue-600" />
          <button className="flex items-center gap-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Units Section */}
        <div className="lg:col-span-2 space-y-6">
          {student.units.map((unit) => (
            <div key={unit.id} className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold mb-1">{unit.name}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Code: {unit.id} | Coordinator: {unit.coordinator} | Weeks: {unit.weeks}
              </p>
              <p className="font-semibold mb-3">Credits Earned: {calculateCredits(unit)} / {unit.credits}</p>

              {/* Scrollable Assignments */}
              <div className="h-48 overflow-y-auto space-y-2">
                {unit.assessments.map((a) => (
                  <div key={a.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer">
                    <div>
                      <h3 className="font-semibold">{a.title}</h3>
                      <p className="text-sm text-gray-500">{a.type === "assignment" ? `${a.weight}%` : `${a.weight}% (Exam)`}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      a.status === "Completed" ? "bg-green-100 text-green-800" :
                      a.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Tracker + Pie Chart */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">Progress Tracker</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <h3 className="font-semibold">Total Credits</h3>
                <p className="text-2xl font-bold">{student.totalCredits}</p>
                <p className="text-sm text-gray-600">
                  You have earned {student.totalCredits} out of {student.requiredCredits} required credits.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <h3 className="font-semibold">Units Enrolled</h3>
                <p className="text-2xl font-bold">{student.units.length}</p>
                <p className="text-sm text-gray-600">You are currently enrolled in {student.units.length} units this semester.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <h3 className="font-semibold">Assessments Completed</h3>
                <p className="text-2xl font-bold">
                  {student.units.flatMap(u => u.assessments).filter(a => a.status === "Completed").length}
                </p>
                <p className="text-sm text-gray-600">Number of assignments and exams you have completed so far.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow">
                <h3 className="font-semibold">Assessments In Progress</h3>
                <p className="text-2xl font-bold">
                  {student.units.flatMap(u => u.assessments).filter(a => a.status === "In Progress").length}
                </p>
                <p className="text-sm text-gray-600">Number of assignments or exams currently in progress.</p>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">Unit Completion</h2>
            <UnitPieChart data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
