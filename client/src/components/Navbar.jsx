import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({hidden}) => {
    const location = useLocation();
    const path = location.pathname;

    // helper function to check active
    const isActive = (route) => path === route;

    return (
        <nav className={`navbar ${hidden ? 'navbar-hidden' : ''}`}>
            <div className="nav-links">
                <Link to="/leaderboard">
                    <img
                        src='img/leaderboardnavbar.svg'
                        alt="Leaderboard"
                        className={isActive('/leaderboard') ? "nav-icon active" : "nav-icon"}
                    />
                </Link>
                <Link to="/">
                    <img
                        src='img/homenavbarheart.svg'
                        alt="Home"
                        className={isActive('/') ? "nav-icon active" : "nav-icon"}
                    />
                </Link>
                <Link to="/about">
                    <img
                        src='img/aboutnavbar.svg'
                        alt="About"
                        className={isActive('/about') ? "nav-icon active" : "nav-icon"}
                    />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
