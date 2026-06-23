import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({ fullname: '', email: '', password: '', role: 'Student' });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      if (data.success) {
        navigate('/login?success=1');
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container d-flex justify-content-center">
        <div className="card" style={{ border: 'none', borderRadius: '16px', background: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden', width: '100%', maxWidth: '400px' }}>
          <div style={{ background: '#4338ca', padding: '2.5rem 2rem', border: 'none' }} className="text-white text-center">
            <h3 className="fw-bold mb-1">Create Account</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: 0 }}>Join your virtual campus today</p>
          </div>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger border-0 bg-danger-subtle text-danger small rounded-3 mb-3">
                Registration failed. Please check your details.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <input type="text" className="form-control" style={{ borderRadius: '8px', padding: '0.75rem' }} placeholder="John Doe" value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <input type="email" className="form-control" style={{ borderRadius: '8px', padding: '0.75rem' }} placeholder="name@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <input type="password" className="form-control" style={{ borderRadius: '8px', padding: '0.75rem' }} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Account Role</label>
                <select className="form-select rounded-3" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-100 mb-3 fw-semibold" style={{ background: '#4338ca', border: 'none', padding: '0.75rem', borderRadius: '8px' }}>
                {loading ? 'Registering...' : 'Register Account'}
              </button>
            </form>
            <div className="text-center">
              <p className="small text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#4338ca' }}>Login Here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
