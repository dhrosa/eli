import { useEffect, useState } from "react";
import Symbol from "./Symbol";

function InitialTheme() {
  let theme = localStorage.getItem("data-theme");
  theme ??= matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return theme;
}
export default function ThemeButton({ className }: { className: string }) {
  const [theme, setTheme] = useState(InitialTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("data-theme", theme);
  });

  const toggle = () => {
    setTheme(theme == "dark" ? "light" : "dark");
  };

  return (
    <a
      className={className}
      href="#"
      title="Toggle Light/Dark Mode"
      onClick={toggle}
    >
      <Symbol name={theme == "dark" ? "light_mode" : "dark_mode"} />
    </a>
  );
}
