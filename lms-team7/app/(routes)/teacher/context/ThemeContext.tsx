"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Allowed themes (keep in sync with your student side if needed)
const THEMES = ["blue", "green", "pink", "purple", "orange", "grey", "yellow"];

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("blue"); // default

  // load saved theme (teacher area key)
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("teacher-theme");
    if (saved && THEMES.includes(saved)) setTheme(saved);
  }, []);

  const updateTheme = (t) => {
    if (!THEMES.includes(t)) return;
    setTheme(t);
    if (typeof window !== "undefined") localStorage.setItem("teacher-theme", t);
  };

  // map classes used by layout/components
  const cardClassByTheme = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    pink: "bg-pink-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
    grey: "bg-gray-50",
    yellow: "bg-yellow-200",
  };
  const buttonClassByTheme = {
    blue: "btn btn-primary",
    green: "btn bg-green-600 text-white hover:bg-green-700",
    pink: "btn bg-pink-600 text-white hover:bg-pink-700",
    purple: "btn bg-purple-600 text-white hover:bg-purple-700",
    orange: "btn bg-orange-600 text-white hover:bg-orange-700",
    grey: "btn bg-gray-700 text-white hover:bg-gray-800",
    yellow: "btn bg-yellow-500 text-black hover:bg-yellow-600",
  };
  const textClassByTheme = {
    blue: "text-blue-900",
    green: "text-green-900",
    pink: "text-pink-900",
    purple: "text-purple-900",
    orange: "text-orange-900",
    grey: "text-gray-900",
    yellow: "text-yellow-900",
    };

  const value = {
    theme,
    setTheme: updateTheme,
    cardClass: cardClassByTheme[theme],
    buttonClass: buttonClassByTheme[theme],
    textClass: textClassByTheme[theme],
    THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
