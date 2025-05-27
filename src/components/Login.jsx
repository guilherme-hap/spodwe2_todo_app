import { useState } from "react";
import { login, register } from "../authService";

const Login = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await register(formData);
      }

      await login(formData);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegistering ? "Cadastre-se" : "Login"}</h2>

        {isRegistering && (
          <input
            name="name"
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">
          {isRegistering ? "Registrar" : "Entrar"}
        </button>

        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
          {isRegistering ? "Já tem conta? Faça login" : "Não tem conta? Registre-se"}
        </p>
      </form>
    </div>
  );
};

export default Login;