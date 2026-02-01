// Navbar.jsx — Navigation bar with active styling for React Router links
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>StudyPortal</h2>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          About
        </NavLink>
        <NavLink 
          to="/concepts" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Concepts Sandbox
        </NavLink>
        <NavLink 
          to="/quiz" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Quiz
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
