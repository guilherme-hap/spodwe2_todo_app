const API_URL = "http://localhost:3000";

export const register = async ({ name, email, password }) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao registrar usuário");
  }

  return await response.json();
};

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao fazer login");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data;
};