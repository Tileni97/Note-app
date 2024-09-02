import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Attempting login...");
      const res = await api.post("/api/token/", { username, password });
      console.log("Login response:", res.data);

      if (res.data.access && res.data.refresh) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        console.log("Tokens stored in localStorage");

        console.log("Login successful, redirecting to home page");
        navigate("/");
        console.log("Navigation called");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto my-12 p-6 rounded-lg shadow-lg max-w-sm">
      <form onSubmit={handleSubmit} className="w-full">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          className="w-full p-2 my-2 border border-gray-300 rounded"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="w-full p-2 my-2 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          className="w-full p-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out disabled:bg-blue-300"
          type="submit"
          disabled={loading}
        >
          {loading ? <LoadingIndicator /> : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>Don't have an account?</p>
        <Link
          to="/register"
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
        >
          Create a new account
        </Link>
      </div>
    </div>
  );
}

export default Login;
