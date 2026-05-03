"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} });

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t || "light");
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dm-theme") || "light";
    setThemeState(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("dm-theme", t);
    applyTheme(t);
  };

  // Always render children — avoid flash of unstyled content
  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
