import React, { useState } from 'react';
import { Scissors, Lock, Mail, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onShowToast }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email.trim(), password);
      onShowToast(`Welcome back, ${userData.name}!`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ background: 'var(--gray-50)' }}>
      <div className="w-full max-w-[420px] animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-xl text-white shadow-lg"
            style={{ background: 'var(--accent-primary)', boxShadow: '0 8px 24px rgba(79,70,229,0.25)' }}
          >
            SS
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--gray-900)' }}>
            SS Tailoring
          </h1>
          <p className="text-sm mt-1.5 flex items-center justify-center gap-1.5 font-medium" style={{ color: 'var(--gray-500)' }}>
            <Scissors className="w-3.5 h-3.5 shrink-0" />
            <span>Management System</span>
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-1 text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign in to your account
          </h2>
          <p className="text-xs mb-6 text-gray-500">
            Enter your credentials to continue
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 animate-slide-down text-left"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 pointer-events-none text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="you@sstailors.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 pointer-events-none text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 text-sm font-semibold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--gray-400)' }}>
          SS Tailoring Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
