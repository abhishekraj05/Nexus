// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import "./Auth.css"; // CSS wahi rahega

// const Register = () => {
//   // 👇 State mein se photoURL hata diya
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       await API.post("/auth/register", formData);
//       // Registration successful -> Redirect to Login
//       navigate("/login");
//     } catch (err) {
//       setErrorMsg(err.response?.data?.msg || "Registration failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
      
//       {/* --- CONTENT AREA (Centered) --- */}
//       <div className="auth-content" style={{ justifyContent: 'center' }}>
        
//         {/* Only Right Side Form */}
//         <div className="auth-right">
            
//             {/* --- MAIN SIGNUP BOX --- */}
//             <div className="auth-box">
//                 <h1 className="logo-font">Nexus</h1>
//                 <p className="signup-text">Sign up to see photos and videos from your friends.</p>

//                 <form className="auth-form" onSubmit={handleSubmit}>
//                     <input 
//                         type="email" 
//                         name="email"
//                         placeholder="Email Address" 
//                         className="auth-input"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//                     <input 
//                         type="text" 
//                         name="name"
//                         placeholder="Full Name" 
//                         className="auth-input"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                     <input 
//                         type="password" 
//                         name="password"
//                         placeholder="Password" 
//                         className="auth-input"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />
                    
//                     {/* ❌ Profile Photo Input Hata Diya */}

//                     <p className="terms-text">
//                         By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
//                     </p>
                    
//                     <button className="auth-btn" disabled={loading}>
//                         {loading ? "Signing Up..." : "Sign Up"}
//                     </button>
//                 </form>

//                 {errorMsg && <p className="error-text">{errorMsg}</p>}
//             </div>

//             {/* --- SWITCH TO LOGIN --- */}
//             <div className="auth-box switch-box">
//                 <p>Have an account? <Link to="/login" className="link-text">Log in</Link></p>
//             </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Auth.css"; 

const Register = () => {
  // 👇 1. State me 'username' add kiya aur 'step' logic lagaya
  const [formData, setFormData] = useState({
    name: "",
    username: "", // New Field
    email: "",
    password: "",
  });

  const [step, setStep] = useState(1); // 1 = Signup, 2 = OTP
  const [otp, setOtp] = useState("");  // OTP Store karne ke liye
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: SIGNUP SUBMIT (OTP Bhejo) ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Backend ab direct login nahi dega, bas email bhejega
      await API.post("/auth/register", formData);
      
      // Success hua to Step 2 (OTP Screen) pe jao
      setStep(2);
      alert("OTP sent to your email!");
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: OTP VERIFY (Login karo) ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Verify API Call
      const res = await API.post("/auth/verify-otp", { 
        email: formData.email, 
        otp: otp 
      });

      // Token Save karo (Login Success)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Home Page par bhej do
      navigate("/");
      
      // Page reload taaki Context update ho jaye (Jugaad fix)
      window.location.reload(); 

    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content" style={{ justifyContent: 'center' }}>
        <div className="auth-right">
            
            <div className="auth-box">
                <h1 className="logo-font">Nexus</h1>
                <p className="signup-text">
                  {step === 1 ? "Sign up to see photos and videos from your friends." : "Check your email for OTP."}
                </p>

                {errorMsg && <p className="error-text">{errorMsg}</p>}

                {/* 👇 CONDITIONAL RENDERING (Step 1 vs Step 2) */}
                
                {step === 1 ? (
                  /* === FORM 1: SIGNUP === */
                  <form className="auth-form" onSubmit={handleSignupSubmit}>
                      <input 
                          type="email" name="email" placeholder="Email Address" 
                          className="auth-input" value={formData.email} onChange={handleChange} required
                      />
                      <input 
                          type="text" name="name" placeholder="Full Name" 
                          className="auth-input" value={formData.name} onChange={handleChange} required
                      />
                      {/* 👇 NEW USERNAME INPUT */}
                      <input 
                          type="text" name="username" placeholder="Username" 
                          className="auth-input" value={formData.username} onChange={handleChange} required
                      />
                      <input 
                          type="password" name="password" placeholder="Password" 
                          className="auth-input" value={formData.password} onChange={handleChange} required
                      />
                      
                      <p className="terms-text">
                          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
                      </p>
                      
                      <button className="auth-btn" disabled={loading}>
                          {loading ? "Sending OTP..." : "Sign Up"}
                      </button>
                  </form>
                ) : (
                  /* === FORM 2: OTP === */
                  <form className="auth-form" onSubmit={handleOtpSubmit}>
                      <input 
                          type="text" 
                          name="otp" 
                          placeholder="Enter 6-Digit OTP" 
                          className="auth-input" 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value)} 
                          maxLength="6"
                          style={{textAlign: 'center', letterSpacing: '4px', fontSize: '18px'}}
                          required
                      />
                      
                      <button className="auth-btn" disabled={loading}>
                          {loading ? "Verifying..." : "Verify & Login"}
                      </button>

                      <p className="terms-text" style={{marginTop:'15px', cursor:'pointer', color:'#0095f6'}} onClick={() => setStep(1)}>
                          Change Email / Back
                      </p>
                  </form>
                )}
            </div>

            {/* Switch to Login */}
            {step === 1 && (
              <div className="auth-box switch-box">
                  <p>Have an account? <Link to="/login" className="link-text">Log in</Link></p>
              </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Register;