import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center mx-auto my-12 p-6 rounded-lg shadow-lg max-w-sm"
    >
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <input
        className="w-11/12 p-2 my-2 border border-gray-300 rounded"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="w-11/12 p-2 my-2 border border-gray-300 rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button
        className="w-11/12 p-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}

export default Login;
