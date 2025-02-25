import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { LogIn } from 'lucide-react';
import '../../styles/auth.css'

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="auth-header">
          <LogIn size={24} color="#4f46e5" />
          <h2 className="auth-title">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label className="forgot-form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="forgot-form-input"
              required
            />
          </div>

          <div className="forgot-form-group">
            <label className="forgot-form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="forgot-form-input"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
            <Link to="/forgot-password" className="btn btn-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="btn btn-link">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
