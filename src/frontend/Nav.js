import { Link } from 'react-router-dom';
import { ThemeButton } from './ThemeButton';

function NavLink({href, label}) {
    return (
        <Link to={href} className="navbar-item">
            {label}
        </Link>
    );
}

function HamburgerButton() {
    return (
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" is-active="true">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    )
}

function Nav() {
    return (
        <nav role="navigation" aria-label="main navigation" className="navbar">
            <div className="container">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item">
                        <h1 className="title">ELI</h1>
                    </Link>
                    <HamburgerButton/>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <NavLink href="/" label="Home"/>
                        <NavLink href="/audiences" label="Audiences"/>
                        <NavLink href="/rules" label="Rules"/>
                        <NavLink href="/conversations" label="Conversations"/>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export {Nav};
