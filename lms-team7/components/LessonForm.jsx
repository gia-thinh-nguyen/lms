// components/LessonForm.jsx
"use client";
import { useState } from "react";

export default function LessonForm() {
  const [form, setForm] = useState({
    unitCode: "", title: "", designerEmail: "",
    description: "", credit: 6, estHoursPerWeek: 6,
    objectives: [], readingList: []
  });
  const [obj, setObj] = useState("");
  const [read, setRead] = useState("");

  const addChip = (key, value, clear) => {
    if (!value.trim()) return;
    setForm(f => ({ ...f, [key]: [...f[key], value.trim()] }));
    clear("");
  };

  return (
    <div className="grid md:grid-cols-3 gap-3">
      <input className="border rounded-lg px-3 py-2" placeholder="Unit code (e.g., CSE1001)" value={form.unitCode} onChange={e=>setForm(f=>({...f, unitCode: e.target.value}))}/>
      <input className="border rounded-lg px-3 py-2" placeholder="Lesson title" value={form.title} onChange={e=>setForm(f=>({...f, title: e.target.value}))}/>
      <input className="border rounded-lg px-3 py-2" placeholder="Designer email" value={form.designerEmail} onChange={e=>setForm(f=>({...f, designerEmail: e.target.value}))}/>
      <textarea className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))}/>
      <input type="number" className="border rounded-lg px-3 py-2" placeholder="Credit (default 6)" value={form.credit} onChange={e=>setForm(f=>({...f, credit: Number(e.target.value)}))}/>
      <input type="number" className="border rounded-lg px-3 py-2" placeholder="Est. hours/week (default 6)" value={form.estHoursPerWeek} onChange={e=>setForm(f=>({...f, estHoursPerWeek: Number(e.target.value)}))}/>

      <div className="md:col-span-3">
        <label className="text-sm font-medium">Objectives</label>
        <div className="flex gap-2 mt-1">
          <input className="border rounded-lg px-3 py-2 flex-1" placeholder="Add objective…" value={obj} onChange={e=>setObj(e.target.value)}/>
          <button type="button" onClick={()=>addChip("objectives", obj, setObj)} className="rounded-lg border px-3">Add</button>
        </div>
        <ChipRow items={form.objectives} onRemove={(i)=>setForm(f=>({...f, objectives: f.objectives.filter((_,idx)=>idx!==i)}))}/>
      </div>

      <div className="md:col-span-3">
        <label className="text-sm font-medium">Reading List</label>
        <div className="flex gap-2 mt-1">
          <input className="border rounded-lg px-3 py-2 flex-1" placeholder="Add reading…" value={read} onChange={e=>setRead(e.target.value)}/>
          <button type="button" onClick={()=>addChip("readingList", read, setRead)} className="rounded-lg border px-3">Add</button>
        </div>
        <ChipRow items={form.readingList} onRemove={(i)=>setForm(f=>({...f, readingList: f.readingList.filter((_,idx)=>idx!==i)}))}/>
      </div>

      <div className="md:col-span-3">
        <button type="button" className="rounded-lg bg-black text-white px-4 py-2">Save (placeholder)</button>
      </div>
    </div>
  );
}

function ChipRow({ items, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((t, i) => (
        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full border flex items-center gap-2">
          {t}
          <button onClick={()=>onRemove(i)} className="text-xs px-2 py-0.5 border rounded">x</button>
        </span>
      ))}
    </div>
  );
}
