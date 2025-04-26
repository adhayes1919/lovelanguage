import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div>
            <nav className="navbar">
                <div className="nav-links">         
                    <Link to="/settings"> Settings</Link>
                    <Link to="/"> Home </Link>
                    <Link to="/leaderboard"> Leaderboard</Link>
                    <Link to="/about"> About </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
