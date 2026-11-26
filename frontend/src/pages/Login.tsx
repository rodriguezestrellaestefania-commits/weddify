import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Login.css";
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const API = "http://localhost:3000";
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Login fallido");
      return;
    }
    localStorage.setItem("token", data.token);
    navigate("/");
  }
  return (
    <div className="login-page">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/videos/Couple_running_along_palm_path_ac9e2864.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />
      <div className="login-box">
        <h1>Bienvenido</h1>
        <p>Inicia sesión para continuar</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Iniciar sesión</button>
        </form>
        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}