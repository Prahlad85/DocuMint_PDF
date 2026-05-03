"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} });

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t || "light");
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dm-theme");
    if (stored) {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    }
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("dm-theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("dm-theme", t);
    applyTheme(t);
  };

  // Determine sonner theme
  const sonnerTheme = theme === "dark" || theme === "blue-gray" ? "dark" : "light";

  // Always render children — avoid flash of unstyled content
  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", setTheme }}>
      {children}
      <Toaster 
        theme={mounted ? sonnerTheme : "light"} 
        position="bottom-right" 
        richColors 
        closeButton 
      />
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
