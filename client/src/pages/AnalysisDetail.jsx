import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, Loader, MessageSquare, Send, User, Bot, Briefcase } from 'lucide-react';

const ProgressBar = ({ score, title }) => {
  const getColor = (s) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const colorClass = getColor(score);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="text-lg font-semibold text-white">{title}</span>
        <span className="text-4xl font-extrabold text-white">{score}<span className="text-xl font-normal text-slate-300">/100</span></span>
      </div>
      <div className="w-full bg-slate-800/50 rounded-full h-3 backdrop-blur-sm overflow-hidden border border-white/10">
        <div 
          className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
        </div>
      </div>
    </div>
  );
};

const AnalysisDetail = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'Hi! I am your AI Resume Assistant. Ask me anything about your resume or how to improve it based on this analysis.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/resume/analysis/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalysis(res.data);
      } catch (err) {
        setError('Failed to load analysis details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Prepare history (excluding the very first greeting and the latest user message to send as "history")
      const historyToSend = chatMessages.slice(1);
      
      const res = await axios.post(`http://localhost:5000/api/resume/analysis/${id}/chat`, 
        { message: userMessage, history: historyToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatMessages([...newMessages, { role: 'ai', content: res.data.reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'ai', content: 'Sorry, I encountered an error while processing your request. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-500 mb-4">{error || 'Analysis not found'}</p>
        <Link to="/history" className="text-primary-600 hover:underline">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen items-stretch">
      
      {/* Left Sidebar: Chatbot */}
      <div className="w-full lg:w-96 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-lg z-10 lg:sticky lg:top-0 lg:h-screen">
        <div className="bg-slate-800 p-4 flex items-center gap-3 flex-shrink-0">
          <div className="bg-primary-500 p-2 rounded-lg text-white flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Resume Assistant</h2>
            <p className="text-slate-300 text-sm">Ask questions about your analysis</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-slate-50/50">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex gap-3 max-w-[90%] self-start">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm">
                <Loader className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3 flex-shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about your resume..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-0"
            disabled={isChatLoading}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Right Content: Analysis Results */}
      <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-6">
            <Link to="/history" className="inline-flex items-center text-slate-500 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="bg-primary-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{analysis.fileName}</h1>
                <p className="text-primary-200">Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex-1 w-full flex md:justify-end">
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm w-full md:max-w-sm">
                  <ProgressBar score={analysis.atsScore || 0} title="ATS Match Score" />
                </div>
              </div>
            </div>
          </div>

          {analysis.jobDescription && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase className="text-primary-500 w-6 h-6" /> Target Job Description
              </h2>
              <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                {analysis.jobDescription}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500 w-6 h-6" /> Strengths
              </h2>
              <ul className="space-y-3">
                {analysis.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
                {(!analysis.strengths || analysis.strengths.length === 0) && (
                  <p className="text-slate-400 italic">No significant strengths identified.</p>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <XCircle className="text-red-500 w-6 h-6" /> Areas for Improvement
              </h2>
              <ul className="space-y-3">
                {analysis.weaknesses?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
                {(!analysis.weaknesses || analysis.weaknesses.length === 0) && (
                  <p className="text-slate-400 italic">No major weaknesses identified.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Missing Keywords */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="text-blue-500 w-6 h-6" /> Missing Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.map((kw, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                    {kw}
                  </span>
                ))}
                {(!analysis.missingKeywords || analysis.missingKeywords.length === 0) && (
                  <p className="text-slate-400 italic">Your keywords look good.</p>
                )}
              </div>
            </div>

            {/* Top Improvements */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100 shadow-sm">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-primary-600 w-6 h-6" /> Top 3 Actions to Take
              </h2>
              <div className="space-y-4">
                {analysis.topImprovements?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-primary-50 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 pt-1">{item}</p>
                  </div>
                ))}
                {(!analysis.topImprovements || analysis.topImprovements.length === 0) && (
                  <p className="text-slate-400 italic">No action items suggested.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section by Section Feedback */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Section-by-Section Feedback</h2>
            <div className="grid grid-cols-1 gap-8">
              {analysis.sectionFeedback && Object.entries(analysis.sectionFeedback).map(([section, feedback]) => (
                <div key={section}>
                  <h3 className="text-lg font-semibold text-slate-800 capitalize mb-2 border-b pb-2">{section}</h3>
                  <p className="text-slate-600 leading-relaxed">{feedback}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;