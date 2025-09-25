import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.error || `Welcome ${data.name}`);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Alumni Login
        </h1>
        <input className="border p-2 w-full mb-3" placeholder="Email"
               onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-3" placeholder="Password"
               onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full py-2 rounded-xl" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
