import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import TaskDashboard from './pages/TaskDashboard.jsx';

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><TaskDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
