import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔁 If already logged in, redirect to chat page
  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", form);
      login(res.data); // store user + token in context
      localStorage.setItem("token", res.data.token); // save token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/chat"); // redirect to chat
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back 👋</h2>
        <p style={{ color: "#777", marginBottom: "20px" }}>
          Login to your Chat Account
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <a href="/register" style={styles.link}>
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}

// 🧩 Inline Modern Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    width: "350px",
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    animation: "fadeIn 0.5s ease",
  },
  heading: {
    color: "#111",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    fontSize: "15px",
    transition: "0.2s",
  },
  button: {
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "bold",
  },
  error: {
    marginTop: "15px",
    color: "#e11d48",
  },
};
