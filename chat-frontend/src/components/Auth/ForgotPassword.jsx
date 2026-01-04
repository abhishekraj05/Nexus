import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api"; // 👈 Login jaisa same import
import "./ForgotPassword.css"; 

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = Reset Form
  
  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 👇 Direct API call like Login page
      await API.post("/auth/forgot-password", { email });
      
      setMessage("OTP sent to your email!");
      setStep(2); // Move to Step 2
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: RESET PASSWORD ---
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 👇 Direct API call like Login page
      await API.post("/auth/reset-password", { email, otp, newPassword });
      
      alert("Password Changed Successfully! Please Login.");
      navigate("/login"); // Redirect to Login
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content" style={{ justifyContent: 'center' }}>
        <div className="auth-right">
          
          <div className="auth-box">
            
            {/* Lock Icon for Visual */}
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>🔒</div>

            <h1 className="logo-font" style={{ fontSize: '20px', marginBottom:'10px', fontWeight: 'bold' }}>
              Trouble Logging In?
            </h1>
            
            <p className="signup-text" style={{ fontSize:'14px', marginBottom:'20px', color: '#8e8e8e' }}>
              {step === 1 
                ? "Enter your email and we'll send you an OTP to get back into your account."
                : "Enter the 6-digit OTP sent to your email and set a new password."}
            </p>

            {/* Error & Success Messages */}
            {error && <p className="error-text" style={{ textAlign:'center', marginBottom: '10px' }}>{error}</p>}
            {message && <p className="success-text" style={{ color: 'green', textAlign:'center', marginBottom: '10px' }}>{message}</p>}

            {/* --- FORM STEP 1: EMAIL --- */}
            {step === 1 && (
              <form className="auth-form" onSubmit={handleSendOtp}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="auth-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button className="auth-btn" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send Login Link"}
                </button>
              </form>
            )}

            {/* --- FORM STEP 2: OTP & NEW PASSWORD --- */}
            {step === 2 && (
              <form className="auth-form" onSubmit={handleResetSubmit}>
                <input 
                  type="text" 
                  placeholder="Enter 6-Digit OTP" 
                  className="auth-input" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                  maxLength={6}
                  style={{ textAlign:'center', letterSpacing:'5px', fontWeight: 'bold' }}
                />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="auth-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                  minLength={6}
                />
                <button className="auth-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="or-divider">
              <div className="line"></div>
              <div className="or-text">OR</div>
              <div className="line"></div>
            </div>

            <Link to="/register" className="link-text" style={{ fontWeight:'bold', fontSize: '14px' }}>
              Create New Account
            </Link>
          </div>

          {/* Back to Login Box */}
          <div className="auth-box switch-box">
            <Link to="/login" className="link-text" style={{ textDecoration:'none', color: '#fff', fontWeight: 'bold' }}>
               Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;