import { useState, useEffect } from "react";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // redireciona manualmente para a página de login
};


const AddTodo = ({ addTodo }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = "";
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Adicione aqui sua nova tarefa"
      onKeyDown={handleKeyPress}
    />
  );
};

const TodoFilter = ({ currentFilter, setFilter }) => {
  return (
    <div className="center-content">
      <a
        href="#"
        id="filter-all"
        onClick={() => setFilter("all")}
        style={{ fontWeight: currentFilter === "all" ? "bold" : "normal" }}
      >
        Todos os itens
      </a>
      <a
        href="#"
        id="filter-done"
        onClick={() => setFilter("done")}
        style={{ fontWeight: currentFilter === "done" ? "bold" : "normal" }}
      >
        Concluídos
      </a>
      <a
        href="#"
        id="filter-pending"
        onClick={() => setFilter("pending")}
        style={{ fontWeight: currentFilter === "pending" ? "bold" : "normal" }}
      >
        Pendentes
      </a>
    </div>
  );
};

const TodoItem = ({ todo, markTodoAsDone }) => {
  const handleClick = () => {
    markTodoAsDone(todo.id);
  };

  return (
    <>
      {todo.done ? (
        <li style={{ textDecoration: "line-through" }}>{todo.text}</li>
      ) : (
        <li>
          {todo.text}
          <button onClick={handleClick}>Concluir</button>
        </li>
      )}
    </>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          text,
          done: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar tarefa");
      }
      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const markTodoAsDone = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          ...todoToUpdate,
          done: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.done;
    if (filter === "pending") return !todo.done;
    return true;
  });

  return (
    <>
        <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Todo List</h1>
          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
      </div>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina SPODWE2
      </div>
      <TodoFilter currentFilter={filter} setFilter={setFilter} />
      <AddTodo addTodo={addTodo} />
      <ul id="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} markTodoAsDone={markTodoAsDone} />
        ))}
      </ul>
    </>
  );
};

export { TodoList };
