import { Link } from "react-router-dom";
import { ThemeButton } from "./ThemeButton";
import { useState } from "react";

function NavLink({ href, label }) {
  return (
    <Link to={href} className="navbar-item">
      {label}
    </Link>
  );
}

function HamburgerButton({ onClick, isActive }) {
  var classNames = "navbar-burger";
  if (isActive) {
    classNames += " is-active";
  }
  return (
    <a
      role="button"
      className={classNames}
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

function Nav() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  var menuClasses = "navbar-menu";
  if (menuActive) {
    menuClasses += " is-active";
  }
  return (
    <nav role="navigation" aria-label="main navigation" className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <h1 className="title">ELI</h1>
        </Link>
        <HamburgerButton onClick={toggleMenu} isActive={menuActive} />
      </div>
      <div className={menuClasses}>
        <div className="navbar-start"></div>
        <div className="navbar-end">
          <NavLink href="/" label="Home" />
          <NavLink href="/audiences" label="Audiences" />
          <NavLink href="/rules" label="Rules" />
          <NavLink href="/conversations" label="Conversations" />
          <ThemeButton className="navbar-item" />
        </div>
      </div>
    </nav>
  );
}

export { Nav };
