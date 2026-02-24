import { Navigate } from 'react-router-dom';
import {  useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;