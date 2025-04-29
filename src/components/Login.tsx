import { useState } from "react";
import axios from "axios";
import { FormResponse } from "../types/formType";

interface Props {
  onSuccess: (form: FormResponse["form"]) => void;
}

const API_BASE = "https://dynamic-form-generator-9rl7.onrender.com";

export default function LoginForm({ onSuccess }: Props) {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedRoll = rollNumber.trim();
    const trimmedName = name.trim();

    if (!trimmedRoll || !trimmedName) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_BASE}/create-user`, {
        rollNumber: trimmedRoll,
        name: trimmedName,
      });

      const response = await axios.get<FormResponse>(
        `${API_BASE}/get-form?rollNumber=${trimmedRoll}`
      );

      onSuccess(response.data.form);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const apiMsg = err.response?.data?.message || err.message;
        setError(`Login failed: ${apiMsg}`);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate>
      <h2 style={{ marginBottom: "20px" }}>Student Login</h2>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        autoFocus
      />

      <label htmlFor="roll">Roll Number</label>
      <input
        id="roll"
        type="text"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        placeholder="Enter your roll number"
      />

      {error && <p className="error">{error}</p>}

      <button id="login" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login & Start"}
      </button>
    </form>
  );
}
