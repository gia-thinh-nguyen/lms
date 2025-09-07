"use client";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/courses?scope=all").then(r=>r.json()),
      fetch("/api/lessons?scope=mine").then(r=>r.json()),
      fetch("/api/students?scope=all").then(r=>r.json()),
    ])
      .then(([c,l,s]) => {
        setCourses(c);
        setLessons(l);
        setStudents(s);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  const activeCourses = courses.filter(c=>c.status==="active").length;

  return (
    <div className="p-6 space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI title="Total Students" value={students.length} />
        <KPI title="Total Lessons" value={lessons.length} />
        <KPI title="Active Courses" value={activeCourses} />
        <KPI title="Inactive Courses" value={courses.length - activeCourses} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>openModal("newLesson")}>New Lesson</button>
        <button className="btn" onClick={()=>openModal("assignDirector")}>Assign/Reassign Director</button>
        <button className="btn" onClick={()=>openModal("enrollStudent")}>Enroll Student</button>
      </div>

      {/* Courses */}
      <Section title="Courses">
        <Table
          columns={["Course ID","Title","Status","Director","Students","Lessons","Actions"]}
          rows={courses.map(c=>[
            c.id, c.title, badge(c.status), c.director ?? "—",
            String(c.enrolled), String(c.lessons),
            <button key={c.id} className="link" onClick={()=>routeTo(`/teacher/courses/${c.id}`)}>View</button>,
          ])}
        />
      </Section>

      {/* Lessons */}
      <Section title="Lessons">
        <Table
          columns={["Lesson ID","Title","Status","Credit","Updated","Designer","Actions"]}
          rows={lessons.map(l=>[
            l.id, l.title, badge(l.status), String(l.credit),
            new Date(l.updatedAt).toLocaleDateString(), l.designer ?? "—",
            <button key={l.id} className="link" onClick={()=>routeTo(`/teacher/lessons/${l.id}`)}>Edit</button>,
          ])}
        />
      </Section>

      {/* Students */}
      <Section title="Students">
        <Table
          columns={["Student ID","Name","Status","Credits","Actions"]}
          rows={students.map(s=>[
            s.id, s.name, badge(s.status), String(s.credits),
            <div key={s.id} className="flex gap-2">
              <button className="link" onClick={()=>openModal("enrollStudent", {studentId:s.id})}>Enroll</button>
              <button className="link" onClick={()=>routeTo(`/teacher/students/${s.id}`)}>View</button>
            </div>
          ])}
        />
      </Section>
    </div>
  );
}

/* --- Helper components --- */

function KPI({title, value}) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Section({title, children}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Table({columns, rows}) {
  return (
    <div className="overflow-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>{columns.map(c=><th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} className="border-t">
              {r.map((cell,j)=><td key={j} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function badge(state) {
  const positive = ["active","completed","student"];
  const cls = positive.includes(state) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{state}</span>;
}

function routeTo(path){ window.location.href = path; }
function openModal(_name,_payload){ /* wire up later */ }
