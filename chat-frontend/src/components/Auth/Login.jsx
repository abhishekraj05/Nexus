import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css"; // CSS wahi rahega, bas structure clean kiya hai

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", form);
      login(res.data); // Context update
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/"); // Redirect to Home
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      
      {/* --- CONTENT AREA (Centered) --- */}
      <div className="auth-content" style={{ justifyContent: 'center' }}>
        
        {/* Only Right Side Form (No Image, No Navbar) */}
        <div className="auth-right">
            
            {/* --- MAIN LOGIN BOX --- */}
            <div className="auth-box">
                <h1 className="logo-font">Nexus</h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="auth-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="auth-input"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    
                    <button className="auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                {errorMsg && <p className="error-text">{errorMsg}</p>}

                <div style={{ textAlign: "center", marginTop: "15px" }}>
              <Link 
                to="/forgot-password" 
                style={{ textDecoration: "none", color: "#0095f6", fontSize: "14px" }}
              >
                Forgot password?
              </Link>
            </div>
            </div>

            {/* --- SWITCH TO SIGNUP --- */}
            <div className="auth-box switch-box">
                <p>Don't have an account? <Link to="/register" className="link-text">Sign up</Link></p>
            </div>

        </div>
      </div>
      
    </div>
  );
};

export default Login;