import React, { useEffect, useState } from 'react';
import { studentsAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';


const empty = { student_id: '', first_name: '', last_name: '', email: '', date_of_birth: '' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    studentsAPI.list().then(r => { setStudents(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setError(''); setModal(true); };
  const openEdit = (s)  => { setForm({ ...s }); setEditing(s.id); setError(''); setModal(true); };
  const close    = () => { setModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await studentsAPI.update(editing, form);
        setMessage('Student updated!');
      } else {
        await studentsAPI.create(form);
        setMessage('Student registered!');
      }
      close();
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'An error occurred.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await studentsAPI.delete(id);
    load();
  };

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.student_id} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Students</h2>
          <p>{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Register Student</button>
      </div>

      {message && <Toaster toastOptions={{ duration: 3000, position: 'top-right' }} toast={message} />}

      <div className="table-card">
        <div className="table-card-header">
          <h3>All Students</h3>
          <input
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: 220 }}
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><div className="icon">◉</div><p>No students found</p></div></td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="mono">{s.student_id}</span></td>
                  <td><strong>{s.first_name} {s.last_name}</strong></td>
                  <td><span className="mono">{s.email}</span></td>
                  <td><span className="mono">{s.date_of_birth}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
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
            <h3>{editing ? 'Edit Student' : 'Register New Student'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required placeholder="e.g. STU001" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
