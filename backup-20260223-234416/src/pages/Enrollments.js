import React, { useEffect, useState } from 'react';
import { enrollmentsAPI, studentsAPI, coursesAPI } from '../api';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [form, setForm]               = useState({ student: '', course: '' });
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      enrollmentsAPI.list(),
      studentsAPI.list(),
      coursesAPI.list(),
    ]).then(([e, s, c]) => {
      setEnrollments(e.data);
      setStudents(s.data);
      setCourses(c.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await enrollmentsAPI.create(form);
      setSuccess('Student enrolled successfully!');
      setModal(false);
      setForm({ student: '', course: '' });
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.non_field_errors?.[0] || JSON.stringify(data) || 'An error occurred.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Enrollments</h2>
          <p>{enrollments.length} total enrollment{enrollments.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(''); setModal(true); }}>
          + Enroll Student
        </button>
      </div>

      {success && <div className="alert alert-success">✓ {success}</div>}

      <div className="table-card">
        <div className="table-card-header"><h3>All Enrollments</h3></div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Course</th>
                <th>Enrolled At</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr><td colSpan="4"><div className="empty-state"><div className="icon">◎</div><p>No enrollments yet</p></div></td></tr>
              ) : enrollments.map((e, i) => (
                <tr key={e.id}>
                  <td><span className="mono">{i + 1}</span></td>
                  <td><strong>{e.student_name}</strong></td>
                  <td><span className="badge badge-b">{e.course_title}</span></td>
                  <td><span className="mono">{new Date(e.enrolled_at).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Enroll Student into Course</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Student</label>
                <select value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} required>
                  <option value="">-- Choose student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.student_id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Course</label>
                <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required>
                  <option value="">-- Choose course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.course_code} — {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Enroll</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
