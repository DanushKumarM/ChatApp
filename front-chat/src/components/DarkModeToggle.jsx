import { useState, useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="absolute top-4 right-3 p-3 rounded-full bg-gray-800 text-white dark:bg-gray-300 dark:text-black transition-all"
    >
      {darkMode ? <BsSun size={12} /> : <BsMoon size={12} />}
    </button>
  );
};

export default DarkModeToggle;
