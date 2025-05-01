// SecureLLMUI.jsx
// Tailwind‑only UI – fixed textarea size 400 × 200 px and button directly underneath.

import React, { useState } from "react";

export default function SecureLLMUI() {
  const [logText, setLogText] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!logText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log_text: logText })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Security Event Analyzer 🛡️</h1>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col gap-4 items-center">
        {/* Fixed‑size textarea 400×200 px */}
        <textarea
          className="w-[400px] h-[200px] p-3 resize-y bg-gray-800/80 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Paste a security log prompt here…"
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
        />

        {/* Button always below textarea */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 px-6 py-2 rounded-xl font-semibold"
        >
          {isLoading ? "Analyzing…" : "Analyze"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {response && (
          <div className="mt-2 text-sm text-center">
            <p><span className="font-semibold">Label:</span> {response.label}</p>
            <p><span className="font-semibold">Confidence:</span> {(response.score * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
