"use client";
import { useEffect, useMemo, useState } from "react";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [classroom, setClassroom] = useState([]);

  const [newLesson, setNewLesson] = useState({
    unitCode: "", title: "", description: "",
    objectives: [], readingList: [],
    estHoursPerWeek: 6, credit: 6, designerEmail: ""
  });
  const [objDraft, setObjDraft] = useState("");
  const [readDraft, setReadDraft] = useState("");

  const [assignDirector, setAssignDirector] = useState({ courseId: "", directorEmail: "" });

  const [newRow, setNewRow] = useState({
    teacherEmail: "", studentEmail: "", courseId: "", unitCode: "",
    startDate: "", durationWeeks: 12, grade: ""
  });

  const totalCredits = useMemo(() => {
    return courses.reduce((sum, c) => {
      const credits = (c.lessons || []).reduce((s, l) => s + (l.credit ?? 0), 0);
      return sum + credits;
    }, 0);
  }, [courses]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [coursesRes, lessonsRes, studentsRes, classroomRes] = await Promise.all([
          fetch("/api/courses").then(r => r.json()),
          fetch("/api/lessons?scope=all").then(r => r.json()),
          fetch("/api/users?role=student").then(r => r.json()),
          fetch("/api/classroom").then(r => r.json()).catch(() => ({ rows: [] })),
        ]);
        setCourses(coursesRes.courses ?? []);
        setLessons(lessonsRes.lessons ?? []);
        setStudents(studentsRes.users ?? []);
        setClassroom(classroomRes.rows ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createLesson(e) {
    e.preventDefault();
    const payload = { ...newLesson };
    payload.objectives  = (payload.objectives || []).filter(Boolean);
    payload.readingList = (payload.readingList || []).filter(Boolean);
    const res = await fetch("/api/lessons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      const { lesson } = await res.json();
      setLessons(prev => [lesson, ...prev]);
      setNewLesson({ unitCode: "", title: "", description: "", objectives: [], readingList: [], estHoursPerWeek: 6, credit: 6, designerEmail: "" });
      setObjDraft(""); setReadDraft("");
    } else {
      alert("Failed to create lesson");
    }
  }

  function pushObjective() {
    if (objDraft.trim()) {
      setNewLesson(l => ({ ...l, objectives: [...(l.objectives||[]), objDraft.trim()] }));
      setObjDraft("");
    }
  }
  function pushReading() {
    if (readDraft.trim()) {
      setNewLesson(l => ({ ...l, readingList: [...(l.readingList||[]), readDraft.trim()] }));
      setReadDraft("");
    }
  }
  function removeChip(listName, idx) {
    setNewLesson(l => ({ ...l, [listName]: l[listName].filter((_,i)=>i!==idx) }));
  }

  async function putDirector(e) {
    e.preventDefault();
    if (!assignDirector.courseId || !assignDirector.directorEmail) return;
    const res = await fetch(`/api/courses/director/${assignDirector.courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ directorEmail: assignDirector.directorEmail }),
    });
    if (res.ok) {
      const { courses } = await fetch("/api/courses").then(r => r.json());
      setCourses(courses);
      setAssignDirector({ courseId: "", directorEmail: "" });
    } else {
      alert("Failed to assign/change director");
    }
  }

  async function addClassroomRow(e) {
    e.preventDefault();
    const res = await fetch("/api/classroom", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newRow)
    });
    if (res.ok) {
      const { rows } = await fetch("/api/classroom").then(r => r.json());
      setClassroom(rows);
      setNewRow({ teacherEmail: "", studentEmail: "", courseId: "", unitCode: "", startDate: "", durationWeeks: 12, grade: "" });
    } else {
      alert("Failed to add classroom row");
    }
  }

  async function updateClassroomRow(id, patch) {
    const res = await fetch("/api/classroom", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch })
    });
    if (res.ok) {
      const { rows } = await fetch("/api/classroom").then(r => r.json());
      setClassroom(rows);
    } else {
      alert("Update failed");
    }
  }

  if (loading) return <div className="p-6">Loading dashboard</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Courses" value={courses.length} />
        <StatCard title="Lessons" value={lessons.length} />
        <StatCard title="Students" value={students.length} />
        <StatCard title="Total Credits (sum of lessons)" value={totalCredits} />
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="overflow-x-auto border rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Course ID</Th><Th>Title</Th><Th>Status</Th><Th>Director</Th><Th>Lessons</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t">
                  <Td>{c.courseId}</Td>
                  <Td>{c.title}</Td>
                  <Td><Badge state={c.status} /></Td>
                  <Td>{c.directorId ? `${c.directorId.firstName} ${c.directorId.lastName}` : <em>Unassigned</em>}</Td>
                  <Td>{(c.lessons || []).length}</Td>
                  <Td className="space-x-2">
                    {/* Add status toggle later if you create PATCH route */}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={putDirector} className="grid md:grid-cols-3 gap-3 pt-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Course ID (e.g., FIT2004)" value={assignDirector.courseId} onChange={e=>setAssignDirector(s=>({...s, courseId: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Director email (teacher)" value={assignDirector.directorEmail} onChange={e=>setAssignDirector(s=>({...s, directorEmail: e.target.value}))}/>
          <button className="rounded-lg bg-black text-white px-4 py-2">Assign / Change Director</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Create Lesson</h2>
        <form onSubmit={createLesson} className="grid md:grid-cols-3 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Unit Code" value={newLesson.unitCode} onChange={e=>setNewLesson(l=>({...l, unitCode: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Title" value={newLesson.title} onChange={e=>setNewLesson(l=>({...l, title: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Designer (your) email" value={newLesson.designerEmail} onChange={e=>setNewLesson(l=>({...l, designerEmail: e.target.value}))}/>
          <textarea className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="Description" value={newLesson.description} onChange={e=>setNewLesson(l=>({...l, description: e.target.value}))}/>
          <input type="number" className="border rounded-lg px-3 py-2" placeholder="Credit (default 6)" value={newLesson.credit} onChange={e=>setNewLesson(l=>({...l, credit: Number(e.target.value)}))}/>
          <input type="number" className="border rounded-lg px-3 py-2" placeholder="Est. hours/week (default 6)" value={newLesson.estHoursPerWeek} onChange={e=>setNewLesson(l=>({...l, estHoursPerWeek: Number(e.target.value)}))}/>

          <div className="md:col-span-3">
            <label className="text-sm font-medium">Objectives</label>
            <div className="flex gap-2 mt-1">
              <input className="border rounded-lg px-3 py-2 flex-1" placeholder="Add objective..." value={objDraft} onChange={e=>setObjDraft(e.target.value)}/>
              <button type="button" onClick={pushObjective} className="rounded-lg border px-3">Add</button>
            </div>
            <ChipRow items={newLesson.objectives} onRemove={i=>removeChip("objectives", i)}/>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-medium">Reading List</label>
            <div className="flex gap-2 mt-1">
              <input className="border rounded-lg px-3 py-2 flex-1" placeholder="Add reading..." value={readDraft} onChange={e=>setReadDraft(e.target.value)}/>
              <button type="button" onClick={pushReading} className="rounded-lg border px-3">Add</button>
            </div>
            <ChipRow items={newLesson.readingList} onRemove={i=>removeChip("readingList", i)}/>
          </div>

          <div className="md:col-span-3">
            <button className="rounded-lg bg-black text-white px-4 py-2">Create Lesson</button>
          </div>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Classroom (Course  Lesson  Student)</h2>
        <form onSubmit={addClassroomRow} className="grid md:grid-cols-3 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Teacher email" value={newRow.teacherEmail} onChange={e=>setNewRow(r=>({...r, teacherEmail: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Student email" value={newRow.studentEmail} onChange={e=>setNewRow(r=>({...r, studentEmail: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Course ID (e.g., FIT2004)" value={newRow.courseId} onChange={e=>setNewRow(r=>({...r, courseId: e.target.value}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Unit Code (e.g., FIT2004-L1)" value={newRow.unitCode} onChange={e=>setNewRow(r=>({...r, unitCode: e.target.value}))}/>
          <input type="date" className="border rounded-lg px-3 py-2" value={newRow.startDate} onChange={e=>setNewRow(r=>({...r, startDate: e.target.value}))}/>
          <input type="number" className="border rounded-lg px-3 py-2" placeholder="Duration (weeks)" value={newRow.durationWeeks} onChange={e=>setNewRow(r=>({...r, durationWeeks: Number(e.target.value)}))}/>
          <input className="border rounded-lg px-3 py-2" placeholder="Grade (optional)" value={newRow.grade} onChange={e=>setNewRow(r=>({...r, grade: e.target.value}))}/>
          <div className="md:col-span-3">
            <button className="rounded-lg bg-black text-white px-4 py-2">Add Row</button>
          </div>
        </form>

        <div className="overflow-x-auto border rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Course</Th><Th>Lesson</Th><Th>Student</Th><Th>Teacher</Th><Th>Start</Th><Th>Duration</Th><Th>Grade</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {classroom.map((row) => (
                <tr key={row._id} className="border-t">
                  <Td>{row.courseRef?.courseId}  {row.courseRef?.title}</Td>
                  <Td>{row.lessonRef?.unitCode}  {row.lessonRef?.title}</Td>
                  <Td>{row.studentRef?.firstName} {row.studentRef?.lastName}</Td>
                  <Td>{row.teacherRef?.firstName} {row.teacherRef?.lastName}</Td>
                  <Td>{row.startDate?.slice(0,10) || "-"}</Td>
                  <Td><InlineNumber value={row.durationWeeks} onSave={(v)=>updateClassroomRow(row._id, { durationWeeks: Number(v) })}/></Td>
                  <Td><InlineText value={row.grade || ""} onSave={(v)=>updateClassroomRow(row._id, { grade: v })}/></Td>
                  <Td>{/* add delete later if you create a DELETE handler */}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
function Th({ children }) { return <th className="text-left font-medium px-3 py-2">{children}</th>; }
function Td({ children }) { return <td className="px-3 py-2 align-top">{children}</td>; }
function Badge({ state }) {
  const positive = ["active","completed","student","teacher"];
  const cls = positive.includes(state) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{state}</span>;
}
function ChipRow({ items = [], onRemove }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((x,i)=>(
        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-xs">
          {x} <button type="button" className="ml-1" onClick={()=>onRemove(i)}>×</button>
        </span>
      ))}
    </div>
  );
}
function InlineNumber({ value, onSave }) {
  const [v, setV] = useState(value);
  return (
    <div className="flex gap-2">
      <input type="number" className="border rounded-lg px-2 py-1 w-24" value={v} onChange={e=>setV(e.target.value)} />
      <button onClick={()=>onSave(v)} className="px-2 py-1 rounded-lg border">Save</button>
    </div>
  );
}
function InlineText({ value, onSave }) {
  const [v, setV] = useState(value);
  return (
    <div className="flex gap-2">
      <input className="border rounded-lg px-2 py-1 w-28" value={v} onChange={e=>setV(e.target.value)} />
      <button onClick={()=>onSave(v)} className="px-2 py-1 rounded-lg border">Save</button>
    </div>
  );
}
