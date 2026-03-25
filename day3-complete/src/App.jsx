import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar } from 'gdg-ui';
import 'gdg-ui/src/styles.css';
import Home from './pages/Home';
import About from './pages/About';
import Concepts from './pages/Concepts';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* We use our custom GDG Navbar but with Router integration */}
        <nav className="gdg-navbar">
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>STUDYPORTAL</div>
          <div className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/concepts">Concepts</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
          </div>
        </nav>

        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
