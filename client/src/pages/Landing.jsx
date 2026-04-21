import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileCheck, Zap, Target, ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-20 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-8 border border-primary-100">
          <Zap className="w-4 h-4" /> Powered by Advanced AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Land Your Dream Job with an <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">AI-Optimized</span> Resume
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Upload your resume and let our intelligent AI analyze it against industry standards. Get instant feedback on ATS compatibility, missing keywords, and actionable improvement tips.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/register" 
            className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 flex items-center justify-center gap-2 group"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-16 flex items-center gap-8 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> Secure & Private</div>
          <div className="flex items-center gap-2"><FileCheck className="w-5 h-5 text-primary-500" /> PDF & DOCX Support</div>
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Instant Results</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our AI system deeply analyzes every section of your resume to ensure it meets the rigorous standards of modern Applicant Tracking Systems (ATS).</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ATS Compatibility Score</h3>
              <p className="text-slate-600 leading-relaxed">Find out exactly how well your resume will perform when scanned by HR recruitment software.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Keyword Optimization</h3>
              <p className="text-slate-600 leading-relaxed">Discover missing industry keywords and skills that recruiters and automated systems are looking for.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Actionable Feedback</h3>
              <p className="text-slate-600 leading-relaxed">Receive personalized, section-by-section advice on how to phrase your experience and highlight strengths.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Ready to upgrade your resume?</h2>
          <p className="text-slate-400 mb-10 text-lg">Join thousands of job seekers who improved their callbacks using our AI analyzer.</p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-400 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
