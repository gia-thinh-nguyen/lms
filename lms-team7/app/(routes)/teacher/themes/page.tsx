"use client";
import { useTheme } from "../context/ThemeContext";

export default function TeacherThemesPage() {
  const { theme, setTheme, THEMES, cardClass, textClass, buttonClass } = useTheme();

  return (
    <div className="max-w-xl">
      <div className={`p-4 rounded-lg mb-4 ${cardClass}`}>
        <h2 className={`text-xl font-semibold ${textClass}`}>Theme</h2>
        <p className={`${textClass} opacity-80`}>Pick a colour theme for the teacher area.</p>
      </div>

      <label className="block text-sm mb-2">Choose theme</label>
      <select
        className="select select-bordered w-full"
        value={theme}
        onChange={(e) => setTheme(e.target.value as typeof THEMES[number])}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
        ))}
      </select>

      <div className="mt-6 p-6 rounded-lg shadow bg-white">
        <p className="text-black font-medium">
          Current: {theme[0].toUpperCase() + theme.slice(1)}
        </p>
        <div className="mt-3">
          <button className={buttonClass}>Example button</button>
        </div>
      </div>
    </div>
  );
}
