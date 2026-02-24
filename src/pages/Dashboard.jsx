import React, { useEffect, useState } from 'react';
import { studentsAPI, coursesAPI, enrollmentsAPI, resultsAPI } from '../api';
import { gradeColor } from '../libs/constant'

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0, results: 0 });
  const [recent, setRecent] = useState({ students: [], results: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentsAPI.list(),
      coursesAPI.list(),
      enrollmentsAPI.list(),
      resultsAPI.list(),
    ]).then(([s, c, e, r]) => {
      setStats({
        students:    s.data.length,
        courses:     c.data.length,
        enrollments: e.data.length,
        results:     r.data.length,
      });
      setRecent({
        students: s.data.slice(-5).reverse(),
        results:  r.data.slice(-5).reverse(),
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Students',   value: stats.students,   },
    { label: 'Active Courses',   value: stats.courses,    },
    { label: 'Enrollments',      value: stats.enrollments },
    { label: 'Results Recorded', value: stats.results,    },
  ];


  if (loading) return (
    <div className="loading"><div className="spinner" /> Loading dashboard...</div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>School Students System — Overview</p>
        </div>
      </div>

      <div className="stats-row">
        {statCards.map(s => (
          <div className="stat-card" key={s.label} >
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="table-card">
          <div className="table-card-header">
            <h3>Recent Students</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {recent.students.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--muted)', padding: '30px' }}>No students yet</td></tr>
              ) : recent.students.map(s => (
                <tr key={s.id}>
                  <td><span className="mono">{s.student_id}</span></td>
                  <td>{s.first_name} {s.last_name}</td>
                  <td><span className="mono">{s.email}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="table-card-header">
            <h3>Recent Results</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {recent.results.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted)', padding: '30px' }}>No results yet</td></tr>
              ) : recent.results.map(r => (
                <tr key={r.id}>
                  <td>{r.student_name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{r.course_title}</td>
                  <td><span className="mono">{r.marks}</span></td>
                  <td><span className={`badge ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
