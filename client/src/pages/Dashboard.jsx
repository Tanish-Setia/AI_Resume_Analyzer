import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isJdDragging, setIsJdDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    if (!file) return;
    
    if (file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      if (file.size <= 5 * 1024 * 1024) {
        setFile(file);
      } else {
        setError('File size must be less than 5MB');
      }
    } else {
      setError('Only PDF and DOCX files are supported');
    }
  };

  const handleJdDragOver = useCallback((e) => {
    e.preventDefault();
    setIsJdDragging(true);
  }, []);

  const handleJdDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsJdDragging(false);
  }, []);

  const handleJdDrop = useCallback((e) => {
    e.preventDefault();
    setIsJdDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetJdFile(droppedFile);
  }, []);

  const handleJdFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetJdFile(selectedFile);
  };

  const validateAndSetJdFile = (file) => {
    setError('');
    if (!file) return;
    
    if (file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'text/plain') {
      if (file.size <= 5 * 1024 * 1024) {
        setJdFile(file);
      } else {
        setError('Job Description file size must be less than 5MB');
      }
    } else {
      setError('Only PDF, DOCX, and TXT files are supported for Job Description');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    if (jdFile) {
      formData.append('jobDescriptionFile', jdFile);
    }
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription.trim());
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Set the analyzed data instead of navigating immediately
      setAnalyzedData(response.data);
      setIsAnalyzing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Analyze Your Resume</h1>
        <p className="text-slate-600 mt-2">Upload your resume in PDF or DOCX format to get instant AI-powered feedback.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop your resume here</h3>
        <p className="text-slate-500 mb-6">or click to browse from your computer (PDF, DOCX up to 5MB)</p>
        
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer bg-white border-2 border-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          Browse Files
        </label>
      </div>

      {/* Job Description Section */}
      <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Job Description <span className="text-slate-400 font-normal text-sm">(Optional)</span></h3>
        <p className="text-slate-500 text-sm mb-4">Paste the job description or upload a file to get a tailored Job Match Score.</p>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <textarea
              className="w-full h-full min-h-[120px] border border-slate-300 rounded-lg p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
              placeholder="Paste job description text here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={!!jdFile}
            ></textarea>
          </div>
          
          <div className="flex items-center justify-center font-medium text-slate-400">OR</div>
          
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 flex flex-col justify-center items-center ${
              isJdDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-slate-50'
            }`}
            onDragOver={handleJdDragOver}
            onDragLeave={handleJdDragLeave}
            onDrop={handleJdDrop}
          >
            {jdFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-primary-500" />
                <p className="font-medium text-slate-700 text-sm">{jdFile.name}</p>
                <button 
                  onClick={() => setJdFile(null)} 
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className={`w-8 h-8 mb-2 ${isJdDragging ? 'text-primary-500' : 'text-slate-400'}`} />
                <p className="text-slate-500 text-sm mb-3">Upload JD File (PDF, DOCX, TXT)</p>
                <input 
                  type="file" 
                  id="jd-file-upload" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleJdFileChange}
                />
                <label 
                  htmlFor="jd-file-upload" 
                  className="cursor-pointer bg-white border border-slate-200 text-slate-600 text-sm font-medium py-1.5 px-4 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Browse
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {file && !analyzedData && (
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full md:w-auto bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing AI...
              </>
            ) : (
              'Generate Analysis'
            )}
          </button>
        </div>
      )}

      {/* Analysis Results View on Dashboard */}
      {analyzedData && (
        <div className="mt-8 bg-white p-8 rounded-2xl border border-primary-100 shadow-lg text-center transform transition-all animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Analysis Complete!</h2>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-2">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={(2 * Math.PI * 70) - ((analyzedData.atsScore || 0) / 100) * (2 * Math.PI * 70)}
                  className={`transition-all duration-1000 ease-out ${
                    analyzedData.atsScore >= 80 ? 'text-green-500' : analyzedData.atsScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-5xl font-extrabold text-slate-800">{analyzedData.atsScore || 0}</span>
                <span className="text-sm font-medium text-slate-500 mt-1">/ 100</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-700">ATS Match Score</h3>
            <p className="text-slate-500 max-w-md mt-2">
              This score indicates how well your resume is optimized for Applicant Tracking Systems based on the provided context.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAnalyzedData(null);
                setFile(null);
                setJdFile(null);
                setJobDescription('');
              }}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Analyze Another
            </button>
            <Link
              to={`/analysis/${analyzedData._id}`}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              View Full Detailed Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
