import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Landing from './pages/Landing';
import AnalysisDetail from './pages/AnalysisDetail';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<div className="container mx-auto px-4 py-8 max-w-6xl"><Login /></div>} />
            <Route path="/register" element={<div className="container mx-auto px-4 py-8 max-w-6xl"><Register /></div>} />
            <Route path="/dashboard" element={<PrivateRoute><div className="container mx-auto px-4 py-8 max-w-6xl"><Dashboard /></div></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><div className="container mx-auto px-4 py-8 max-w-6xl"><History /></div></PrivateRoute>} />
            <Route path="/analysis/:id" element={<PrivateRoute><AnalysisDetail /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
