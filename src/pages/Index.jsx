import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11 text-center">
            <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(15,23,42,0.08)', padding: '4rem 3rem', border: '1px solid rgba(226,232,240,0.8)' }}>
              <div className="mb-4">
                <span className="badge px-3 py-2 rounded-pill fw-bold text-uppercase small" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                  Next-Gen Learning
                </span>
              </div>
              <h1 className="display-5 fw-bold mb-2" style={{ color: '#0f172a' }}>Welcome to SchoolLMS</h1>
              <p className="text-muted lead mb-5 mx-auto" style={{ maxWidth: '580px' }}>
                Your unified digital campus dashboard. Please select your dedicated portal below to access courses, deployments, and announcements.
              </p>
              <div className="row g-4 justify-content-center">
                {/* Teacher Portal */}
                <div className="col-sm-6 col-md-5">
                  <div
                    className="card h-100 p-4"
                    onClick={() => navigate('/login?role=Teacher')}
                    style={{ border: '2px solid #e2e8f0', borderRadius: '16px', cursor: 'pointer', textDecoration: 'none', background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(5,150,105,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div className="card-body">
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem', backgroundColor: '#d1fae5' }}>
                        👨‍🏫
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Teacher Portal</h4>
                      <p className="text-muted small mb-0">Manage course classrooms, launch custom assignments, and broadcast news feed notices.</p>
                    </div>
                  </div>
                </div>
                {/* Student Portal */}
                <div className="col-sm-6 col-md-5">
                  <div
                    className="card h-100 p-4"
                    onClick={() => navigate('/login?role=Student')}
                    style={{ border: '2px solid #e2e8f0', borderRadius: '16px', cursor: 'pointer', background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(79,70,229,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div className="card-body">
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem', backgroundColor: '#e0e7ff' }}>
                        🎓
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Student Portal</h4>
                      <p className="text-muted small mb-0">Track academic tracks, download syllabus resources, and upload completed task files.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
