import "./css/App.css";
import "./css/Login.css";
import { useState, useEffect } from "react";
import { TodoList } from "./components/TodoList";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <main className="container">
      {isAuthenticated ? (
        <TodoList />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}

export default App;