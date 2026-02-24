import React from 'react'

const StudentRecordModal = () => {
  return (
    <>
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
        </div>
    </>
  )
}

export default StudentRecordModal