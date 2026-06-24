import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: '', title: '', message: '' });
  const [editForm, setEditForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const { data } = await API.get('/announcements');
      setAnnouncements(data.announcements || []);
    } catch (_) {}
  };

  useEffect(() => {
  fetchAnnouncements();
  fetchCourses();
}, []);
  

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.courseId || !form.title || !form.message) {
      setError('All fields are required');
      return;
    }
    try {
      await API.post('/announcements', form);
      setForm({ courseId: '', title: '', message: '' });
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post announcement');
    }
  };

  const handleEdit = async (id) => {
    if (!editForm.courseId || !editForm.title || !editForm.message) return;
    try {
      await API.put(`/announcements/${id}`, editForm);
      setEditingId(null);
      fetchAnnouncements();
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Adakah anda pasti mahu memadam pengumuman ini?')) return;
    try {
      await API.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (_) {}
  };

  const fetchCourses = async () => {
  try {
    const { data } = await API.get('/courses');
    setCourses(data.courses || []);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Layout>
      {/* Broadcast form — Teacher only, mirrors announcements.jsp form */}
      {user?.role === 'Teacher' && (
        <div className="card mb-4 p-2" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div className="card-header bg-white fw-bold text-dark border-0 pt-3 fs-5">Broadcast Announcement</div>
          <div className="card-body">
            {error && <div className="alert alert-danger small rounded-3 border-0">{error}</div>}
            <form onSubmit={handleAdd}>
              <div className="row g-3">
                <div className="col-md-3">
                  <input type="text" className="form-control rounded-3" placeholder="Course ID" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} required />
                </div>
                <div className="col-md-9">
                  <input type="text" className="form-control rounded-3" placeholder="Announcement Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-12">
                  <textarea className="form-control rounded-3" rows="2" placeholder="Type message details..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-warning px-4 fw-semibold mt-3 text-dark">Post Notice</button>
            </form>
          </div>
        </div>
      )}

      <h3 className="fw-bold text-dark mb-3">Notice Board</h3>
      {announcements.length > 0 ? announcements.map(a => (
        <div key={a._id} className="card mb-3 shadow-sm" style={{ border: 'none', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
          <div className="card-body p-3">
            {/* Edit inline form */}
            {editingId === a._id ? (
              <div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-secondary">Course ID</label>
                  <select
                    className="form-control"
                    value={form.courseId}
                    onChange={e => setForm({
                      ...form,
                      courseId: e.target.value
                    })}
                    required
                  >
                    <option value="">-- Select Course --</option>

                    {courses.map(course => (
                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.courseCode
                          ? `${course.courseCode} - ${course.courseName}`
                          : course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-secondary">Title</label>
                  <input type="text" className="form-control form-control-sm" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-secondary">Message</label>
                  <textarea className="form-control form-control-sm" rows="3" value={editForm.message || ''} onChange={e => setEditForm({ ...editForm, message: e.target.value })} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm px-3" onClick={() => handleEdit(a._id)}>Save Changes</button>
                  <button className="btn btn-secondary btn-sm px-3" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{a.title}</h5>
                  <p className="text-secondary mb-0 small">{a.message}</p>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                    Course: {a.courseId?.courseName || '#'}
                  </span>
                  {user?.role === 'Teacher' && (
                    <div className="btn-group btn-group-sm mt-1">
                      <button className="btn btn-outline-primary" onClick={() => {
                        setEditingId(a._id);
                        setEditForm({ courseId: a.courseId?._id || a.courseId, title: a.title, message: a.message });
                      }}>Edit</button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(a._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )) : (
        <div className="card p-4 text-center text-muted" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          No announcements available at the moment.
        </div>
      )}
    </Layout>
  );
}
