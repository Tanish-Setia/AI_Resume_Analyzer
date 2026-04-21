import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, FileText, ChevronRight, AlertCircle, Loader } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/resume/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Analysis History</h1>
        <p className="text-slate-600 mt-2">Review your past resume analyses and track your improvement.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No analyses yet</h3>
          <p className="text-slate-500 mb-6">Upload your first resume to see the magic happen.</p>
          <Link to="/dashboard" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {history.map((item) => (
              <li key={item._id} className="hover:bg-slate-50 transition-colors">
                <Link to={`/analysis/${item._id}`} className="block p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-lg">{item.fileName}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-1">ATS Match Score</div>
                        <div className={`font-bold text-xl ${
                          (item.atsScore || 0) >= 80 ? 'text-green-600' : 
                          (item.atsScore || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.atsScore || 0}/100
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-400" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;
