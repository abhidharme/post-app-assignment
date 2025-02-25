import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.state?.email) {
      toast.error('Email not found. Please try again');
      return navigate('/forgot-password');
    }
    setLoading(true);
    try {
      await authApi.verifyOtp({
        email: location.state.email,
        otp,
        newPassword,
      });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="auth-header">
          <CheckCircle size={24} color="#4f46e5" />
          <h2 className="auth-title">Verify OTP</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label className="forgot-form-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="forgot-form-input"
              required
            />
          </div>

          <div className="forgot-form-group">
            <label className="forgot-form-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {loading ? 'Verifying...' : 'Verify & Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
