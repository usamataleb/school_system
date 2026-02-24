import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';


const empty = { course_code: '', title: '', description: '', credits: 3 };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);
  const [error, setError]     = useState('');
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    coursesAPI.list().then(r => { setCourses(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setError(''); setModal(true); };
  const openEdit = (c)  => { setForm({ ...c }); setEditing(c.id); setError(''); setModal(true); };
  const close    = () => { setModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await coursesAPI.update(editing, form);
        setMessage('Course updated!');
      } else {
        await coursesAPI.create(form);
        setMessage('Course added!');
      }
      close(); load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'An error occurred.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await coursesAPI.delete(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Courses</h2>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Course</button>
      </div>

      {message && <Toaster toastOptions={{ duration: 3000, position: 'top-right' }} toast={message} />}

      <div className="table-card">
        <div className="table-card-header"><h3>All Courses</h3>           <p>{courses.length} available course{courses.length !== 1 ? 's' : ''}</p>
 </div>
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Description</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><div className="icon">▣</div><p>No courses added yet</p></div></td></tr>
              ) : courses.map(c => (
                <tr key={c.id}>
                  <td><span className="mono">{c.course_code}</span></td>
                  <td><strong>{c.title}</strong></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.78rem', maxWidth: 260 }}>{c.description || '—'}</td>
                  <td>
                    <span className="badge badge-a">{c.credits} cr</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Course' : 'Add New Course'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Course Code</label>
                  <input value={form.course_code} onChange={e => setForm({ ...form, course_code: e.target.value })} required placeholder="e.g. CS101" />
                </div>
                <div className="form-group">
                  <label>Credits</label>
                  <input type="number" min="1" max="10" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Course title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
