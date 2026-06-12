import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, ShieldAlert } from 'lucide-react';
import { useStore, api } from '../store/useStore';

export default function AuthPages({ isRegisterInitial = false }) {
  const navigate = useNavigate();
  const loginStore = useStore((state) => state.login);
  const addToast = useStore((state) => state.addToast);
  
  const [isRegister, setIsRegister] = useState(isRegisterInitial);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (isRegister && !name)) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        const res = await api.post('/auth/register', { name, email, password, role });
        loginStore(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        const res = await api.post('/auth/login', { email, password });
        loginStore(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
      addToast(err.response?.data?.error || 'Authentication failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#1a202c] flex flex-col font-sans">
      {/* Official Government Banner */}
      <div className="bg-[#e2e8f0] border-b border-[#cbd5e0] px-6 py-1.5 text-[11px] text-[#4a5568] flex items-center space-x-2 select-none">
        <span className="inline-block w-4 h-2.5 bg-sky-600 border border-white"></span>
        <span>An official website of the National Education & Security Agency</span>
      </div>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-[#cbd5e0] bg-white p-8 rounded-sm shadow-md border-t-4 border-[#002c6c]">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-10 h-10 rounded bg-[#f0f4f8] border border-[#d2d6dc] flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#002c6c]" />
            </div>
            <h2 className="text-lg font-serif font-bold text-[#002c6c] tracking-tight">
              {isRegister ? 'Portal Access: Register Account' : 'Portal Access: Secure Sign-In'}
            </h2>
            <p className="text-xs text-[#718096] mt-1.5 font-medium">
              National AI & Cybersecurity Training Registry
            </p>
          </div>

          {/* Security System Warning Banner */}
          <div className="mb-5 p-3 rounded-sm bg-[#fffaf0] border border-[#feebc8] text-[11px] text-[#7b341e] flex gap-2.5 items-start font-medium leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-[#dd6b20] flex-shrink-0 mt-0.5" />
            <div>
              <strong>SECURITY NOTICE:</strong> This is a secure agency network. Unauthorized logins, tampering, or monitoring are strictly prohibited under penalty of law.
            </div>
          </div>

          {/* Credentials Info hints */}
          {!isRegister && (
            <div className="mb-5 p-3 rounded-sm bg-[#edf2f7] border border-[#cbd5e0] text-xs text-[#2d3748] space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Public Access Credentials:</div>
              <div>Student Role: <span className="font-semibold">user@lms.com</span> / <span className="font-semibold">password123</span></div>
              <div>Admin Role: <span className="font-semibold">admin@lms.com</span> / <span className="font-semibold">password123</span></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a5568]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a5568]">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@agency.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a5568]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Access Role Selection */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a5568]">Requested Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                      role === 'user'
                        ? 'border-[#002c6c] bg-[#002c6c] text-white shadow-sm'
                        : 'border-[#cbd5e0] bg-white text-neutral-600 hover:bg-[#f8fafc]'
                    }`}
                  >
                    Student (Public)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                      role === 'admin'
                        ? 'border-[#002c6c] bg-[#002c6c] text-white shadow-sm'
                        : 'border-[#cbd5e0] bg-white text-neutral-600 hover:bg-[#f8fafc]'
                    }`}
                  >
                    Instructor (Staff)
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-3 text-xs uppercase tracking-wider font-bold"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isRegister ? 'Register Account' : 'Authenticate Credentials'
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs text-[#718096]">
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className="text-[#002c6c] hover:underline font-bold ml-1 cursor-pointer"
                >
                  Secure Sign-In
                </button>
              </p>
            ) : (
              <p>
                Need to create a profile?{' '}
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                  className="text-[#002c6c] hover:underline font-bold ml-1 cursor-pointer"
                >
                  Register Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Footer */}
      <footer className="border-t border-[#cbd5e0] bg-[#e2e8f0] py-6 text-center text-[#718096] text-[11px] font-sans">
        <div className="max-w-md mx-auto space-y-2">
          <p>© 2026 National Education & Security Agency. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-black">Privacy Directive</a>
            <span>•</span>
            <a href="#" className="hover:text-black">Systems Access Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
