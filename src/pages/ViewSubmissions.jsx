import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [gradeInputs, setGradeInputs] = useState({});
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/submissions/assignment/${assignmentId}`);
        setSubmissions(data.submissions || []);
        const inputs = {};
        data.submissions?.forEach(s => {
          inputs[s._id] = { grade: s.grade, feedback: s.feedback || '' };
        });
        setGradeInputs(inputs);
      } catch (_) {}
    };
    fetch();
  }, [assignmentId]);

  const handleGrade = async (submissionId) => {
    const inp = gradeInputs[submissionId];
    if (inp.grade === '' || inp.grade === undefined) return;
    try {
      await API.put(`/submissions/${submissionId}/grade`, { grade: inp.grade, feedback: inp.feedback });
      setSavedId(submissionId);
      setTimeout(() => setSavedId(null), 3000);
    } catch (_) {}
  };

  return (
    <Layout>
      {/* Success alert — mirrors ?msg=saved */}
      {savedId && (
        <div className="alert alert-success border-0 shadow-sm rounded-3 alert-dismissible fade show mb-4">
          ✨ <strong>Successfully saved!</strong> The assignment grade and feedback have been updated to the student's profile.
          <button className="btn-close" onClick={() => setSavedId(null)} />
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">📂 Assignment Submissions</h3>
          <p className="text-muted small mb-0">Managing submissions for Assignment ID: #{assignmentId?.slice(-6)}</p>
        </div>
        <Link to="/assignments" className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-semibold">← Back to Ledger</Link>
      </div>

      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3">Submission ID</th>
                <th className="py-3">Student</th>
                <th className="py-3">Submitted File Resource</th>
                <th className="py-3">Submission Description</th>
                <th className="py-3">Submit Date</th>
                <th className="py-3" style={{ width: '150px' }}>Grade (100)</th>
                <th className="py-3">Feedback Comments</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? submissions.map((s, i) => (
                <tr key={s._id}>
                  <td className="fw-semibold text-secondary">#{i + 1}</td>
                  <td><span className="badge bg-secondary">{s.studentId?.fullname || `Student #${i + 1}`}</span></td>
                  <td>
                    <a href={s.fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#0d6efd', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      📄 {s.fileName}
                    </a>
                  </td>
                  <td className="small text-dark fw-medium">
                    {s.submissionNotes?.trim() ? s.submissionNotes : <span className="text-muted fst-italic small">No description.</span>}
                  </td>
                  <td className="small text-muted">{new Date(s.submitDate).toLocaleString()}</td>
                  <td colSpan="2">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input type="number" step="0.01" min="0" max="100" className="form-control form-control-sm rounded-3"
                          value={gradeInputs[s._id]?.grade ?? ''}
                          onChange={e => setGradeInputs(prev => ({ ...prev, [s._id]: { ...prev[s._id], grade: e.target.value } }))}
                          required />
                      </div>
                      <div className="col-md-8">
                        <div className="d-flex gap-2">
                          <textarea className="form-control form-control-sm rounded-3" rows="1" placeholder="Add custom feedback..."
                            value={gradeInputs[s._id]?.feedback || ''}
                            onChange={e => setGradeInputs(prev => ({ ...prev, [s._id]: { ...prev[s._id], feedback: e.target.value } }))} />
                          <button className="btn btn-success btn-sm px-3 rounded-3 fw-semibold" onClick={() => handleGrade(s._id)}>Save</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center text-muted py-4">No submissions found for this assignment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
