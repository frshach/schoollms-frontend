import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [pendingCounts, setPendingCounts] = useState({});
  const [form, setForm] = useState({ courseId: '', title: '', description: '', dueDate: '' });
  const [submitForms, setSubmitForms] = useState({});
  const [error, setError] = useState('');
  const [submitErrors, setSubmitErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileRefs = useRef({});

  const fetchAll = async () => {
    try {
      const { data } = await API.get('/assignments');
      const list = data.assignments || [];
      setAssignments(list);

      if (user?.role === 'Student') {
        // Check submission status for each assignment
        const checks = await Promise.all(
          list.map(a => API.get(`/submissions/check/${a._id}`).then(r => ({ id: a._id, submitted: r.data.submitted })))
        );
        setSubmittedIds(new Set(checks.filter(c => c.submitted).map(c => c.id)));
      }

      if (user?.role === 'Teacher') {
        // Get pending counts for each assignment
        const counts = await Promise.all(
          list.map(a => API.get(`/assignments/${a._id}/pending-count`).then(r => ({ id: a._id, count: r.data.count })))
        );
        const countMap = {};
        counts.forEach(c => { countMap[c.id] = c.count; });
        setPendingCounts(countMap);
      }
    } catch (_) {}
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.courseId || !form.title || !form.description || !form.dueDate) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await API.post('/assignments', form);
      setForm({ courseId: '', title: '', description: '', dueDate: '' });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (e, assignmentId) => {
    e.preventDefault();
    const sf = submitForms[assignmentId] || {};
    const fileInput = fileRefs.current[assignmentId];

    if (!fileInput?.files[0]) {
      setSubmitErrors(prev => ({ ...prev, [assignmentId]: 'Please choose a submission file' }));
      return;
    }
    if (!sf.submissionNotes?.trim()) {
      setSubmitErrors(prev => ({ ...prev, [assignmentId]: 'Submission description is required' }));
      return;
    }

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('assignmentFile', fileInput.files[0]);
    formData.append('submissionNotes', sf.submissionNotes);

    try {
      await API.post('/submissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmittedIds(prev => new Set([...prev, assignmentId]));
      setSubmitErrors(prev => ({ ...prev, [assignmentId]: '' }));
    } catch (err) {
      setSubmitErrors(prev => ({ ...prev, [assignmentId]: err.response?.data?.error || 'Submission failed' }));
    }
  };

  return (
    <Layout>
      {/* Add assignment form — Teacher only */}
      {user?.role === 'Teacher' && (
        <div className="card mb-4 p-2" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div className="card-header bg-white fw-bold text-dark border-0 pt-3 fs-5">Publish New Assignment</div>
          <div className="card-body">
            {error && <div className="alert alert-danger small rounded-3 border-0">{error}</div>}
            <form onSubmit={handleAddAssignment}>
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="small fw-semibold text-secondary">Course ID</label>
                  <input type="text" className="form-control" placeholder="Course ID" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="small fw-semibold text-secondary">Assignment Title</label>
                  <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <label className="small fw-semibold text-secondary">Due Date</label>
                  <input type="date" className="form-control" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
                </div>
                <div className="col-md-12">
                  <label className="small fw-semibold text-secondary">Description</label>
                  <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3 px-4" disabled={loading}>
                {loading ? 'Posting...' : 'Post Assignment'}
              </button>
            </form>
          </div>
        </div>
      )}

      <h3 className="fw-bold text-dark mb-3">Assignment Ledger</h3>
      <div className="card p-3" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Assignment ID</th>
              <th>Course</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Description</th>
              <th style={{ width: '340px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? assignments.map((a, i) => (
              <tr key={a._id}>
                <td className="fw-semibold text-secondary">#{i + 1}</td>
                <td>#{a.courseId?.courseName || a.courseId}</td>
                <td className="fw-bold text-dark">{a.title}</td>
                <td><span className="badge bg-danger-subtle text-danger">{new Date(a.dueDate).toLocaleDateString()}</span></td>
                <td className="small text-muted">{a.description}</td>
                <td>
                  {user?.role === 'Student' ? (
                    submittedIds.has(a._id) ? (
                      <span className="badge bg-success px-3 py-2 rounded-2">Submitted</span>
                    ) : (
                      <form onSubmit={(e) => handleSubmitAssignment(e, a._id)} className="p-2 border rounded-3 bg-light">
                        {submitErrors[a._id] && (
                          <div className="alert alert-danger small rounded-2 border-0 py-1 mb-2">{submitErrors[a._id]}</div>
                        )}
                        <div className="mb-2">
                          <label className="form-label d-block text-secondary fw-bold small mb-1">Choose Submission File:</label>
                          <input type="file" className="form-control form-control-sm" ref={el => fileRefs.current[a._id] = el} required />
                        </div>
                        <div className="mb-2">
                          <label className="form-label d-block text-secondary fw-bold small mb-1">Submission Description:</label>
                          <input type="text" className="form-control form-control-sm" placeholder="e.g., Final draft upload"
                            value={submitForms[a._id]?.submissionNotes || ''}
                            onChange={e => setSubmitForms(prev => ({ ...prev, [a._id]: { ...prev[a._id], submissionNotes: e.target.value } }))}
                            required />
                        </div>
                        <button type="submit" className="btn btn-success btn-sm w-100 fw-semibold shadow-sm">Submit Assignment</button>
                      </form>
                    )
                  ) : (
                    /* Teacher view with pending count badge */
                    <div className="d-inline-flex align-items-center">
                      <Link to={`/submissions/${a._id}`} className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold">
                        View Submissions
                      </Link>
                      {pendingCounts[a._id] > 0 && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: '#dc3545', color: 'white', fontWeight: 700, fontSize: '0.75rem',
                          minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '50%',
                          marginLeft: '8px', animation: 'pulse 2s infinite'
                        }} title={`${pendingCounts[a._id]} Not Yet Reviewed`}>
                          {pendingCounts[a._id]}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center text-muted">No assignments available.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }`}</style>
    </Layout>
  );
}
