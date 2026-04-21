import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, LogOut, History, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600">
            <Brain className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">AI ResumeAnalyzer</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 flex items-center gap-1 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/history" className="text-slate-600 hover:text-primary-600 flex items-center gap-1 transition-colors">
                  <History className="w-4 h-4" /> History
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
