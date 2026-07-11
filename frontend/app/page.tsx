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

        {/* Upload Resume */}
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

        {/* Job Description */}
        <div className="mt-6">
          <label className="font-semibold">Job Description</label>

          <textarea
            rows={8}
            className="mt-2 w-full border rounded-lg p-3"
            placeholder="Paste the Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={analyzeResume}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Resume Score */}
            <div className="bg-green-100 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-green-800">
                Resume Score
              </h2>

              <p className="text-5xl font-bold mt-3">
                {result.resume_score}%
              </p>
            </div>

            {/* Job Match Score */}
            <div className="bg-blue-100 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-blue-800">
                Job Match Score
              </h2>

              <p className="text-5xl font-bold mt-3">
                {result.job_match_score}%
              </p>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-green-700">
                ✅ Strengths
              </h2>

              <ul className="list-disc pl-5 space-y-2">
                {result.strengths?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-600">
                💡 Suggestions
              </h2>

              <ul className="list-disc pl-5 space-y-2">
                {result.suggestions?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Matched Skills */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                🎯 Matched Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.matched_skills?.length > 0 ? (
                  result.matched_skills.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-green-500 text-white px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p>No matched skills found.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-red-700">
                ❌ Missing Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.missing_skills?.length > 0 ? (
                  result.missing_skills.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-red-500 text-white px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p>No missing skills.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}