import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseName: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      setCourses(data.courses || []);
    } catch (_) {}
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.courseName || !form.description) {
      setError('Course name and description are required');
      return;
    }
    setLoading(true);
    try {
      await API.post('/courses', form);
      setForm({ courseName: '', description: '' });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Course Management</h2>
      </div>

      {/* Add course form — Teacher only, mirrors courses.jsp form */}
      {user?.role === 'Teacher' && (
        <div className="card mb-4 p-2" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div className="card-header bg-white fw-bold text-dark border-0 pt-3 fs-5">Create New Course</div>
          <div className="card-body">
            {error && <div className="alert alert-danger small rounded-3 border-0">{error}</div>}
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Course Name</label>
                <input type="text" className="form-control rounded-3" placeholder="e.g., Object Oriented Systems Design"
                  value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Description</label>
                <textarea className="form-control rounded-3" rows="2" placeholder="Enter course description criteria..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <button className="btn btn-primary px-4 fw-semibold" disabled={loading}>
                {loading ? 'Adding...' : 'Add Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Course list — mirrors courses.jsp table */}
      <div className="card" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div className="card-header bg-white fw-bold text-dark border-0 pt-3 fs-5">Available Course Catalog</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0 table-hover">
              <thead style={{ backgroundColor: '#f1f5f9' }}>
                <tr>
                  <th className="ps-4" style={{ color: '#475569', fontWeight: 600 }}>ID</th>
                  <th style={{ color: '#475569', fontWeight: 600 }}>Course Name</th>
                  <th className="pe-4" style={{ color: '#475569', fontWeight: 600 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? courses.map((c, i) => (
                  <tr key={c._id}>
                    <td className="ps-4 fw-semibold text-secondary">#{i + 1}</td>
                    <td className="fw-bold text-dark">{c.courseName}</td>
                    <td className="pe-4 text-muted small">{c.description}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center text-muted py-4">No courses available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
