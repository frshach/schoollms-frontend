import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../utils/api';

export default function StudentGrades() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/submissions/my');
        setSubmissions(data.submissions || []);
      } catch (_) {}
    };
    fetch();
  }, []);

  return (
    <Layout>
      <h3 className="fw-bold text-dark mb-3">Your Assignment Results & Marks</h3>
      <div className="card p-3" style={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Assignment</th>
              <th>Course</th>
              <th>Sent File Name</th>
              <th>Submission Date</th>
              <th>Grade</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? submissions.map(s => (
              <tr key={s._id}>
                <td><span className="badge bg-primary-subtle text-primary">Assignment: {s.assignmentId?.title || '#'}</span></td>
                <td><span className="badge bg-dark-subtle text-dark-emphasis">Course: {s.assignmentId?.courseId || '#'}</span></td>
                <td>
                  <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-decoration-none fw-semibold text-primary">
                    📄 {s.fileName}
                  </a>
                </td>
                <td className="small text-muted">{new Date(s.submitDate).toLocaleString()}</td>
                <td>
                  {s.grade === 0 && (!s.feedback || s.feedback.trim() === '') ? (
                    <span className="badge bg-warning-subtle text-warning">Awaiting Review</span>
                  ) : (
                    <strong className="text-success">{s.grade} / 100</strong>
                  )}
                </td>
                <td>
                  <p className="mb-0 small text-dark">
                    {s.feedback?.trim() ? s.feedback : <em>Tiada komen disediakan.</em>}
                  </p>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center text-muted py-4">Anda belum menghantar sebarang tugasan lagi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
