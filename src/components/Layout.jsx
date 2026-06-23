import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await API.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return (
    <>
      {/* ── Navbar — mirrors JSP navbar with blue bg, user badge, logout ── */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: '#0d6efd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dashboard">
            <span>🏫</span> SchoolLMS
          </Link>
          <div className="d-flex align-items-center gap-3">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <span>👤</span>
              <span><strong>{user?.fullname}</strong></span>
              <span className="badge bg-white text-primary text-uppercase px-2 py-1" style={{ fontSize: '0.7rem' }}>{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-sm btn-danger px-3 rounded-pill fw-semibold shadow-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '56px' }}>
        {/* ── Sidebar — mirrors all JSP sidebar menus ── */}
        <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '1.5rem 1rem', flexShrink: 0 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Academic Modules
          </div>
          <ul className="sidebar-menu" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li><Link className={isActive('/dashboard')} to="/dashboard"><span>📊</span> <span>Dashboard Home</span></Link></li>
            <li><Link className={isActive('/courses')} to="/courses"><span>📚</span> <span>Courses Matrix</span></Link></li>
            <li><Link className={isActive('/assignments')} to="/assignments"><span>📝</span> <span>Assignments Ledger</span></Link></li>
            <li><Link className={isActive('/announcements')} to="/announcements"><span>📢</span> <span>Announcements Board</span></Link></li>
            {user?.role === 'Student' && (
              <li><Link className={isActive('/grades')} to="/grades"><span>🏆</span> <span>My Grades & Feedback</span></Link></li>
            )}
          </ul>
        </aside>

        {/* ── Main content area ── */}
        <main style={{ flexGrow: 1, padding: '2.5rem', backgroundColor: '#f8fafc' }}>
          {children}
        </main>
      </div>
    </>
  );
}
