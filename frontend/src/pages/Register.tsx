import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Register.css";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const API = "http://localhost:3000";

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Error al crear la cuenta");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("No se ha podido conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <video
        className="register-background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="/videos/Couple_running_along_palm_path_ac9e2864.mp4"
          type="video/mp4"
        />
      </video>

      <div className="register-video-overlay" />

      <div className="register-box">
        <h1>Crear cuenta</h1>
        <p>Regístrate y comienza tu aventura</p>

        {error && (
          <p className="register-error">{error}</p>
        )}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            autoComplete="name"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="register-login-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}