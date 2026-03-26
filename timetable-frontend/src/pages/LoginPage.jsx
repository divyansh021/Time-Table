import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  // 🧠 State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🧠 Error handling
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🧠 AuthContext (global user state)
  const { login } = useContext(AuthContext);

  // 🔐 Handle Login
  const handleLogin = async () => {
    setError("");

    // ⚠️ Basic validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    try {
      // 🔥 REAL API CALL (instead of mock)
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 🔐 Save token in localStorage
      localStorage.setItem("token", data.token);

      // 👤 Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🌍 Update global state
      login(data.user);

      alert("Login successful!");

      // 🚀 Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {/* ❌ Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* 📧 Email Input */}
        <input
          type="email"
          placeholder="Enter email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔒 Password Input */}
        <input
          type="password"
          placeholder="Enter password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔐 Login Button */}
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        {/* 🆕 Register Button */}
        <button
          style={styles.registerButton}
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    marginBottom: "10px",
  },
  registerButton: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #007bff",
    backgroundColor: "white",
    color: "#007bff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};

export default LoginPage;