"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "blue" | "green" | "pink" | "purple" | "orange" | "grey" | "yellow";
type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cardClass: string;
  buttonClass: string;
  textClass: string;
  THEMES: Theme[];
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const THEMES: Theme[] = ["blue", "green", "pink", "purple", "orange", "grey", "yellow"];
  const [theme, setTheme] = useState<Theme>("blue");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("teacher-theme") as Theme | null;
    if (saved && (THEMES as readonly string[]).includes(saved)) setTheme(saved);
  }, []);

  const updateTheme = (t: Theme) => {
    setTheme(t);
    if (typeof window !== "undefined") localStorage.setItem("teacher-theme", t);
  };

  const cardClasses: Record<Theme, string> = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    pink: "bg-pink-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
    grey: "bg-gray-50",
    yellow: "bg-yellow-200",
  };
  const buttonClasses: Record<Theme, string> = {
    blue: "btn btn-primary",
    green: "btn bg-green-600 text-white hover:bg-green-700",
    pink: "btn bg-pink-600 text-white hover:bg-pink-700",
    purple: "btn bg-purple-600 text-white hover:bg-purple-700",
    orange: "btn bg-orange-600 text-white hover:bg-orange-700",
    grey: "btn bg-gray-700 text-white hover:bg-gray-800",
    yellow: "btn bg-yellow-500 text-black hover:bg-yellow-600",
  };
  const textClasses: Record<Theme, string> = {
    blue: "text-blue-900",
    green: "text-green-900",
    pink: "text-pink-900",
    purple: "text-purple-900",
    orange: "text-orange-900",
    grey: "text-gray-900",
    yellow: "text-yellow-900",
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        cardClass: cardClasses[theme],
        buttonClass: buttonClasses[theme],
        textClass: textClasses[theme],
        THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
