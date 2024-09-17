import { Link } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import LoginButton from "./LoginButton";
import { useState } from "react";

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link to={href} className="navbar-item">
      {label}
    </Link>
  );
}

function HamburgerButton({
  onClick,
  isActive,
}: {
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <a
      role="button"
      className={"navbar-burger " + (isActive ? "is-active" : "")}
      aria-label="menu"
      aria-expanded="false"
      onClick={onClick}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  );
}

export default function Nav() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  return (
    <nav role="navigation" aria-label="main navigation" className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <h1 className="title">ELI</h1>
        </Link>
        <HamburgerButton onClick={toggleMenu} isActive={menuActive} />
      </div>
      <div className={"navbar-menu " + (menuActive ? "is-active" : "")}>
        <div className="navbar-start"></div>
        <div className="navbar-end">
          <NavLink href="/" label="Home" />
          <NavLink href="/audiences/" label="Audiences" />
          <NavLink href="/rules/" label="Rules" />
          <NavLink href="/c/" label="Conversations" />
          <LoginButton className="navbar-item" />
          <ThemeButton className="navbar-item" />
        </div>
      </div>
    </nav>
  );
}
