import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiZap, FiBarChart2, FiAward } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch { /* handled by api interceptor */ }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-content">
          <div className="auth-brand">✓</div>
          <h1>TodoFlow</h1>
          <p>Your intelligent productivity companion. Manage tasks, track progress, and achieve more with our smart suite of tools.</p>
          <div className="auth-features">
            {[
              { icon: <FiZap />, title: 'Smart Productivity Score', desc: 'AI-powered insights into your workflow' },
              { icon: <FiBarChart2 />, title: 'Advanced Analytics', desc: 'Detailed metrics and performance trends' },
              { icon: <FiAward />, title: 'Achievement System', desc: 'Earn badges and track milestones' },
            ].map((f, i) => (
              <div key={i} className="auth-feature">
                <div className="auth-feature-icon">{f.icon}</div>
                <div className="auth-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrapper">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue to your workspace</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" type="email" placeholder="you@example.com" style={{ paddingLeft: 40 }} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="Enter your password" style={{ paddingLeft: 40, paddingRight: 40 }} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
