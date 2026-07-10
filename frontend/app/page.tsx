"use client";

import { useState } from "react";
import api from "../services/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await api.post("/upload-resume", formData);

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          AI Career Copilot 🚀
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Upload your resume and compare it with a job description.
        </p>

        <div className="mt-8">
          <label className="font-semibold">Upload Resume</label>

          <input
            type="file"
            className="mt-2 w-full border rounded-lg p-2"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <div className="mt-6">
          <label className="font-semibold">Job Description</label>

          <textarea
            rows={8}
            className="mt-2 w-full border rounded-lg p-3"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button
          onClick={analyzeResume}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {result && (
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-3">
              Analysis Result
            </h2>

            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}