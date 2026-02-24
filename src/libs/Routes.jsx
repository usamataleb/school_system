
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Courses from '../pages/Courses';
import Enrollments from '../pages/Enrollments';
import Results from '../pages/Results';
import Layout from '../components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppRoutes() {
  const { isAuth } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/students" element={<Layout><Students /></Layout>} />
      <Route path="/courses" element={<Layout><Courses /></Layout>} />
      <Route path="/enrollments" element={<Layout><Enrollments /></Layout>} />
      <Route path="/results" element={<Layout><Results /></Layout>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


export default AppRoutes;