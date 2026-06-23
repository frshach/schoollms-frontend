import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ courses: 0, assignments: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          API.get('/courses'),
          API.get('/assignments'),
        ]);
        setCounts({
          courses: cRes.data.courses?.length || 0,
          assignments: aRes.data.assignments?.length || 0,
        });
      } catch (_) {}
    };
    fetchCounts();
  }, []);

  const isTeacher = user?.role === 'Teacher';

  return (
    <Layout>
      {/* Welcome panel — mirrors dashboard.jsp welcome-panel */}
      <div className="mb-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.fullname}!</h2>
        <p className="text-muted mb-0">Here's a personalized look at your academic dashboard profile metrics today.</p>
      </div>

      <div className="row g-4">
        {/* Card 1 — mirrors bg-success metric card */}
        <div className="col-12 col-md-6">
          <div className="card text-white h-100" style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: '#198754' }}>
            <div className="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <h6 className="text-uppercase fw-bold small mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {isTeacher ? 'Deployed Courses' : 'My Enrolled Courses'}
                </h6>
                <h2 className="display-5 fw-bold mb-0">{counts.courses}</h2>
              </div>
              <div className="mt-3 small">
                <Link to="/courses" className="text-white text-decoration-none fw-semibold">
                  {isTeacher ? 'Manage Course Matrix →' : 'Explore active classrooms →'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — mirrors bg-dark metric card */}
        <div className="col-12 col-md-6">
          <div className="card text-white h-100" style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: '#212529' }}>
            <div className="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <h6 className="text-uppercase fw-bold small mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {isTeacher ? 'Active Assignments' : 'Pending Tasks'}
                </h6>
                <h2 className="display-5 fw-bold mb-0">{counts.assignments}</h2>
              </div>
              <div className="mt-3 small">
                <Link to="/assignments" className="text-white text-decoration-none fw-semibold">
                  {isTeacher ? 'View Evaluation Registry →' : 'Complete submission entries →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
