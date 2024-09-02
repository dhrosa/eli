import { Link } from 'react-router-dom';
import { ThemeButton } from './ThemeButton';

function NavLink({href, label}) {
    return (
        <Link to={href} className="contrast">
            {label}
        </Link>
    );
}

function Nav() {
    return (
        <header className="container">      
            <nav>
                <ul>
                    <li>
                        <Link to="/" className="outline">
                            <hgroup><h1>ELI</h1><p>Explain Like I'm ...</p></hgroup>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li><NavLink href="/" label="Home"/></li>
                    <li><NavLink href="/audiences" label="Audiences"/></li>
                    <li><NavLink href="/rules" label="Rules"/></li>
                    <li><NavLink href="/conversations" label="Conversations"/></li>
                    <li><ThemeButton/></li>
                </ul>
            </nav>
        </header>
    );
}

export {Nav};
