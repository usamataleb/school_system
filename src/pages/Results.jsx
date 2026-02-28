import React, { useEffect, useState } from 'react';
import { resultsAPI, enrollmentsAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { gradeColor, navItems } from '../libs/constant'





export default function Results() {
  const [results, setResults]         = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm]    = useState({ enrollment: '', marks: '' });
  const [error, setError]   = useState('');
  const [message, setMessage]   = useState('');

  const [usedEnrollments, setUsedEnrollments] = useState(new Set());

  const load = () => {
    setLoading(true);
    Promise.all([resultsAPI.list(), enrollmentsAPI.list()]).then(([r, e]) => {
      setResults(r.data);
      const used = new Set(r.data.map(res => res.enrollment));
      setUsedEnrollments(used);
      setEnrollments(e.data.filter(en => !used.has(en.id)));
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resultsAPI.create({ enrollment: form.enrollment, marks: parseFloat(form.marks) });
      setMessage('Result recorded!');
      setModal(false);
      setForm({ enrollment: '', marks: '' });
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'An error occurred.');
    }
  };

  const avg = results.length
    ? (results.reduce((s, r) => s + r.marks, 0) / results.length).toFixed(1)
    : '—';

  const gradeCounts = results.reduce((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
          <h2>Results</h2>

        <button className="btn btn-primary" onClick={() => { setError(''); setModal(true); }}>
          + Record Marks
        </button>
      </div>

      {message && <Toaster toastOptions={{ duration: 3000, position: 'top-right' }} toast={message} />}

      <div className="table-card">
        <div className="table-card-header"><h3>All Results</h3>         <div>
          <p>Total average: <strong style={{ color: 'var(--accent)' }}>{avg}</strong></p>
        </div> </div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="6"><div className="empty-state"><i className={`fa-solid fa-${navItems[5].icon}`}></i><p>No results recorded yet</p></div></td></tr>
              ) : results.map((r, i) => (
                <tr key={r.id}>
                  <td><span className="mono">{i + 1}</span></td>
                  <td><strong>{r.student_name}</strong></td>
                  <td  style={{ color: 'var(--muted)', fontSize: '0.78rem' }}  >{r.course_title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono">{r.marks}</span>
                      <div style={{ flex: 1, maxWidth: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${r.marks}%`, height: '100%', background: r.marks >= 90 ? 'var(--accent)' : r.marks >= 70 ? '#f59e0b' : 'var(--danger)', borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                  <td><span className="mono">{new Date(r.recorded_at).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
    <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Record Student Marks</h3>
            {error && <div className="alert alert-error">{error}</div>}
            {enrollments.length === 0 ? (
              <div className="alert" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                All enrollments already have results recorded.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Enrollment</label>
                  <select value={form.enrollment} onChange={e => setForm({ ...form, enrollment: e.target.value })} required>
                    <option value="">-- Choose student & course --</option>
                    {enrollments.map(en => (
                      <option key={en.id} value={en.id}>{en.student_name} → {en.course_title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marks (0 – 100)</label>
                  <input
                    type="number" min="0" max="100" step="0.5"
                    value={form.marks}
                    onChange={e => setForm({ ...form, marks: e.target.value })}
                    required placeholder="e.g. 85"
                  />
                  {form.marks && (
                    <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--muted)' }}>
                      Grade preview: <span className={`badge ${gradeColor(form.marks >= 90 ? 'A' : form.marks >= 80 ? 'B' : form.marks >= 70 ? 'C' : form.marks >= 60 ? 'D' : 'F')}`}>
                        {form.marks >= 90 ? 'A' : form.marks >= 80 ? 'B' : form.marks >= 70 ? 'C' : form.marks >= 60 ? 'D' : 'F'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Record</button>
                </div>
              </form>
            )}
          </div>
        </div>      )}
    </div>
  );
}
