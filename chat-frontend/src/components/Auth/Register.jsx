// import React, { useState } from "react";
// import axios from "axios";
// import API from "../../api/api";
// // import { AuthContext } from "../../context/AuthContext";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     photoURL: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // handle input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       // FIX 1: 'form' ki jagah 'formData' (state variable) ka istemal kiya
//       // FIX 2: "api/auth/register" ki jagah "/auth/register" kiya
//       const res = await API.post("/auth/register", formData);
      
//       setMessage("✅ Registration successful! You can now login.");
//       setFormData({ name: "", email: "", password: "", photoURL: "" });
//     } catch (err) {
//       setMessage(err.response?.data?.msg || "❌ Registration failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.heading}>Create an Account</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//           <input
//             type="text"
//             name="photoURL"
//             placeholder="Profile Photo URL (optional)"
//             value={formData.photoURL}
//             onChange={handleChange}
//             style={styles.input}
//           />

//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         {message && <p style={styles.message}>{message}</p>}

//         <p style={{ marginTop: "15px" }}>
//           Already have an account?{" "}
//           <a href="/login" style={styles.link}>
//             Login here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Inline Styles
// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(135deg, #007BFF, #00C6FF)",
//     fontFamily: "sans-serif",
//   },
//   card: {
//     background: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     width: "350px",
//     boxShadow: "0 0 15px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   heading: {
//     marginBottom: "20px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     padding: "10px",
//     marginBottom: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     padding: "10px",
//     background: "#007BFF",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   message: {
//     marginTop: "15px",
//     color: "#333",
//   },
//   link: {
//     color: "#007BFF",
//     textDecoration: "none",
//     fontWeight: "bold",
//   },
// };

// export default Register;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Auth.css"; // CSS wahi rahega

const Register = () => {
  // 👇 State mein se photoURL hata diya
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await API.post("/auth/register", formData);
      // Registration successful -> Redirect to Login
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      
      {/* --- CONTENT AREA (Centered) --- */}
      <div className="auth-content" style={{ justifyContent: 'center' }}>
        
        {/* Only Right Side Form */}
        <div className="auth-right">
            
            {/* --- MAIN SIGNUP BOX --- */}
            <div className="auth-box">
                <h1 className="logo-font">Nexus</h1>
                <p className="signup-text">Sign up to see photos and videos from your friends.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address" 
                        className="auth-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        className="auth-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        className="auth-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* ❌ Profile Photo Input Hata Diya */}

                    <p className="terms-text">
                        By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
                    </p>
                    
                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {errorMsg && <p className="error-text">{errorMsg}</p>}
            </div>

            {/* --- SWITCH TO LOGIN --- */}
            <div className="auth-box switch-box">
                <p>Have an account? <Link to="/login" className="link-text">Log in</Link></p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Register;