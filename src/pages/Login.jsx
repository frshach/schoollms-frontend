import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'User';
  const successParam = searchParams.get('success');

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', {
        email: form.email,
        password: form.password,
        expectedRole: role,
      });

      if (data.success) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card" style={{ border: 'none', borderRadius: '16px', background: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {/* Header — mirrors card-header-custom */}
              <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', padding: '2.5rem 2rem', border: 'none' }} className="text-white text-center">
                <h3 className="fw-bold mb-1">Welcome Back</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: 0 }}>
                  Sign in to the <strong>{role} Portal</strong>
                </p>
              </div>
              <div className="card-body p-4">
                {/* Success message — mirrors login.jsp ?success=1 */}
                {successParam && (
                  <div className="alert alert-success border-0 bg-success-subtle text-success small rounded-3">
                    Registration successful! Please login using your credentials.
                  </div>
                )}
                {/* Error messages — mirrors original error param logic */}
                {error === 'unauthorized' && (
                  <div className="alert alert-danger border-0 bg-danger-subtle text-danger small rounded-3 mb-3">
                    Access Denied: You are not authorized for this portal.
                  </div>
                )}
                {error === 'invalid' && (
                  <div className="alert alert-danger border-0 bg-danger-subtle text-danger small rounded-3 mb-3">
                    Invalid email or password.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="expectedRole" value={role} />
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      placeholder="name@school.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      style={{ padding: '0.625rem' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-secondary">Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ padding: '0.625rem' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 mb-3 fw-semibold"
                    style={{ background: '#4f46e5', border: 'none', padding: '0.75rem', borderRadius: '8px' }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#4f46e5' }}>Register Here</Link>
                  </p>
                  <Link to="/" className="d-block small text-secondary mt-3 text-decoration-none">← Back to Portal Selection</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
