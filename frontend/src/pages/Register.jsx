import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      await api.post("/api/user/register/", { username, password });
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center mx-auto my-12 p-6 rounded-lg shadow-lg max-w-sm"
    >
      <h1 className="text-2xl font-bold mb-6">Register</h1>
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
      <input
        className="w-11/12 p-2 my-2 border border-gray-300 rounded"
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        placeholder="Confirm Password"
      />
      {loading && <LoadingIndicator />}
      <button
        className="w-11/12 p-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        type="submit"
      >
        Register
      </button>
    </form>
  );
}

export default Register;
