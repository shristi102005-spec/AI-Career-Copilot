"use client";

import { useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [tailoredResult, setTailoredResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coverLetter,setCoverLetter]=useState("");

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

  const tailorResume = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await api.post("/tailor-resume", formData);

      if (response.data.error) {
        alert(response.data.message);
        setLoading(false);
        return;
      }
      console.log(JSON.stringify(response.data, null, 2));
      setTailoredResult(response.data);
    } catch (error: any) {
      console.error(error);
    
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
    
      alert(message);
    }

    setLoading(false);
  };

  const generateCoverLetter = async () => {

    if(!file){
    alert("Upload Resume");
    return;
    }
    
    setLoading(true);
    
    const formData=new FormData();
    
    formData.append("file",file);
    formData.append("job_description",jobDescription);
    
    try{
    
    const response=await api.post(
    "/generate-cover-letter",
    formData
    );
    
    setCoverLetter(response.data.cover_letter);
    
    }catch(err){
    
    console.log(err);
    
    alert("Failed");
    
    }
    
    setLoading(false);
    
    }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">

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

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={analyzeResume}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          <button
            onClick={tailorResume}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
          >
             Tailor Resume
          </button>

          <button
            onClick={generateCoverLetter}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
             Generate Cover Letter
          </button>
        </div>

        {/* ATS Analysis */}
        {result && (
          <div className="mt-8 space-y-6">

            <div className="bg-green-100 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-green-800">
                Resume Score
              </h2>

              <p className="text-5xl font-bold mt-3">
                {result.resume_score}%
              </p>
            </div>

            <div className="bg-blue-100 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-blue-800">
                Job Match Score
              </h2>

              <p className="text-5xl font-bold mt-3">
                {result.job_match_score}%
              </p>
            </div>

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

        {/* AI Resume Tailoring */}
        {tailoredResult && (
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6 space-y-6">

            <h2 className="text-3xl font-bold text-purple-700">
               AI Tailored Resume
            </h2>

            <div className="bg-purple-100 p-5 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                ATS Score
              </h3>

              <p className="text-4xl font-bold">
                {tailoredResult.ats_score}%
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Professional Summary
              </h3>

              <div className="leading-7">
  <ReactMarkdown>
    {tailoredResult.tailored_summary}
  </ReactMarkdown>
</div>
            </div>

            <div>
  <h3 className="text-xl font-bold text-green-700 mb-2">
    Improved Projects
  </h3>

  <div className="space-y-5">
    {tailoredResult.tailored_projects?.map(
      (project: any, index: number) => (
        <div
          key={index}
          className="border rounded-xl p-4 bg-gray-50"
        >
          <h4 className="text-lg font-bold text-blue-700">
            {project.title}
          </h4>

          <div className="flex flex-wrap gap-2 mt-3">
           {project.technologies
            ?.split("|")
            .map((tech: string, i: number) => (
              <span
                key={i}
                className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
              >
                {tech.trim()}
              </span>
            ))}
        </div>
          <ul className="list-disc pl-6 mt-4 space-y-2">
  {project.description?.map(
    (point: string, i: number) => (
      <li key={i}>
  <ReactMarkdown>
    {point}
  </ReactMarkdown>
</li>
    )
  )}
</ul>
        </div>
      )
    )}
   
  </div>
</div>

<div>
  <h3 className="text-xl font-bold text-orange-600 mb-4">
    Changes Made
  </h3>

  <div className="space-y-5">
    {tailoredResult.changes?.map((change: any, index: number) => (
      <div
        key={index}
        className="border rounded-xl p-5 bg-orange-50"
      >
        <h4 className="text-lg font-bold text-orange-700">
          {change.section}
          {change.item && ` - ${change.item}`}
        </h4>

        {change.description ? (
  <p className="mt-3 text-gray-700">
    {change.description}
  </p>
) : (
  <ul className="list-disc pl-6 mt-3 space-y-2">
    {change.bullet_changes?.map((item: string, i: number) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)}


      </div>
    ))}
  </div>
</div>
          </div>
        )}
       {coverLetter && (
  <div className="mt-10 bg-white rounded-xl shadow-lg p-6">

    <h2 className="text-3xl font-bold text-green-700 mb-6">
      📄 AI Generated Cover Letter
    </h2>

    <div className="bg-gray-100 rounded-lg p-6 whitespace-pre-wrap leading-8">
      {coverLetter}
    </div>

  </div>
)}
      </div>
    </main>
  );
}