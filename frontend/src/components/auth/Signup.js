import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../store/slices/authSlice';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }
    const result = await dispatch(signup(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="auth-header">
          <UserPlus size={24} color="#4f46e5" />
          <h2 className="auth-title">Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label className="forgot-form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="forgot-form-input"
              required
            />
          </div>

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

          <div className="forgot-form-group">
            <label className="forgot-form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="forgot-form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="btn btn-link">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
