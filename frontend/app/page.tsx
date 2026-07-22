"use client";

import { ClipLoader } from "react-spinners";
import { jsPDF } from "jspdf";
import { useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import { useDropzone } from "react-dropzone";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [tailoredResult, setTailoredResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coverLetter,setCoverLetter]=useState("");
  const [interviewResult, setInterviewResult] = useState<any>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  if (!mounted) return null;

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
    
    };

    const downloadCoverLetter = () => {
      if (!coverLetter) {
        alert("Generate a cover letter first.");
        return;
      }
    
      const doc = new jsPDF();
    
      doc.setFontSize(18);
      doc.text("AI Generated Cover Letter", 20, 20);
    
      doc.setFontSize(12);
    
      const lines = doc.splitTextToSize(coverLetter, 170);
    
      doc.text(lines, 20, 35);
    
      doc.save("Cover_Letter.pdf");
    };

    const downloadTailoredResume = () => {

      if (!tailoredResult) {
        alert("Tailor your resume first.");
        return;
      }
    
      const doc = new jsPDF();
    
      let y = 20;
    
      doc.setFontSize(20);
      doc.text("AI Tailored Resume", 20, y);
    
      y += 15;
    
      doc.setFontSize(14);
      doc.text(`ATS Score: ${tailoredResult.ats_score}%`, 20, y);
    
      y += 15;
    
      doc.setFontSize(16);
      doc.text("Professional Summary", 20, y);
    
      y += 10;
    
      doc.setFontSize(12);
    
      const summary = doc.splitTextToSize(
        tailoredResult.tailored_summary,
        170
      );
    
      doc.text(summary, 20, y);
    
      y += summary.length * 7 + 10;
    
      doc.setFontSize(16);
      doc.text("Projects", 20, y);
    
      y += 10;
    
      tailoredResult.tailored_projects?.forEach((project: any) => {
    
        doc.setFontSize(14);
        doc.text(project.title, 20, y);
    
        y += 8;
    
        doc.setFontSize(11);
    
        const tech = doc.splitTextToSize(
          "Technologies: " + project.technologies,
          170
        );
    
        doc.text(tech, 20, y);
    
        y += tech.length * 6 + 4;
    
        project.description.forEach((point: string) => {
    
          const lines = doc.splitTextToSize(
            "• " + point,
            165
          );
    
          doc.text(lines, 25, y);
    
          y += lines.length * 6 + 2;
    
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
    
        });
    
        y += 8;
    
      });
    
      doc.setFontSize(16);
    
      doc.text("Changes Made", 20, y);
    
      y += 10;
    
      tailoredResult.changes?.forEach((change: any) => {
    
        const heading =
          change.section +
          (change.item ? ` - ${change.item}` : "");
    
        doc.setFontSize(13);
    
        doc.text(heading, 20, y);
    
        y += 8;
    
        if (change.description) {
    
          const lines = doc.splitTextToSize(
            change.description,
            165
          );
    
          doc.setFontSize(11);
    
          doc.text(lines, 25, y);
    
          y += lines.length * 6 + 4;
    
        }
    
        if (change.bullet_changes) {
    
          change.bullet_changes.forEach((bullet: string) => {
    
            const lines = doc.splitTextToSize(
              "• " + bullet,
              165
            );
    
            doc.text(lines, 25, y);
    
            y += lines.length * 6 + 2;
    
          });
    
        }
    
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
    
      });
    
      doc.save("AI_Tailored_Resume.pdf");
    
    };

    const generateInterviewQuestions = async () => {

      if (!file) {
        alert("Upload Resume");
        return;
      }
    
      setLoading(true);
    
      const formData = new FormData();
    
      formData.append("file", file);
      formData.append("job_description", jobDescription);
    
      try {
    
        const response = await api.post(
          "/generate-interview-questions",
          formData
        );
    
        setInterviewResult(response.data);
    
      } catch (err) {
    
        console.log(err);
    
        alert("Failed to generate interview questions.");
    
      }
    
      setLoading(false);
    
    };

    const copyText = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Copied Successfully!");
    };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center p-8 transition-all duration-500">
     <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_60px_rgba(59,130,246,0.15)] rounded-3xl p-10 w-full max-w-4xl transition-all duration-300">
     <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-400">
       AI Career Copilot 🚀
     </h1>

        <div className="flex justify-end mb-4">

  <button
    onClick={() =>
      setTheme(theme === "dark" ? "light" : "dark")
    }
    className="px-4 py-2 rounded-lg bg-gray-800 text-white dark:bg-white dark:bg-slate-800 dark:text-black transition"
  >
    {theme === "dark"
      ? "☀ Light Mode"
      : "🌙 Dark Mode"}
  </button>

</div>

        <p className="text-center text-gray-500 text-lg mt-4">
          Upload your resume and compare it with a job description.
        </p>

        {/* Upload Resume */}
        <div className="mt-8">

         <label className="font-semibold">
           Upload Resume
         </label>

         <div
           {...getRootProps()}
           className={`mt-3 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
           ${
             isDragActive
               ? "border-blue-600 bg-blue-100"
               : "border-gray-400 bg-gray-50 hover:bg-slate-50 dark:bg-slate-900"
           }`}
         >

           <input {...getInputProps()} />

           {isDragActive ? (

            <p className="text-blue-700 font-semibold">
              📂 Drop your resume here...
            </p>

          ) : (

           <>
             <p className="text-lg font-semibold">
              📄 Drag & Drop Resume Here
             </p>

             <p className="text-gray-500 mt-2">
               or click to browse
             </p>

             <p className="text-sm text-gray-400 mt-2">
                Supports PDF & DOCX
             </p>
           </>

         )}

       </div>

       {file && (

       <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-5 shadow">

       <h3 className="text-lg font-bold text-green-700">
       📄 Resume Uploaded Successfully
       </h3>

       <div className="mt-4 space-y-2">

       <p>
       <strong>Filename:</strong> {file.name}
       </p>

       <p>
       <strong>Size:</strong>{" "}
       {(file.size / 1024 / 1024).toFixed(2)} MB
       </p>

       <p>
       <strong>Type:</strong> {file.type}
       </p>

       <p className="text-green-700 font-semibold">
       <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
       Ready for Analysis
       </span>
       </p>

       </div>

       </div>

       )}
    </div>

        {/* Job Description */}
        <div className="mt-6">
          <label className="font-semibold">Job Description</label>

          <textarea
            rows={8}
            className="mt-2 w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-gray-400"
            placeholder="Paste the Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={analyzeResume}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? (
               <ClipLoader color="white" size={20} />
            ) : (
                "Analyze Resume"
            )}

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

          
            
          <button
            onClick={generateInterviewQuestions}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold"
          >
            AI Interview Coach
          </button>
        </div>

        {/* ATS Analysis */}
        {result && (
          <div className="mt-8 space-y-6">

<div className="bg-green-100 rounded-xl p-6 shadow">
  <h2 className="text-xl font-bold text-green-800">
    Resume Score
  </h2>

  <div className="w-full bg-gray-300 rounded-full h-4 mt-4">
    <div
      className="bg-green-600 h-4 rounded-full transition-all duration-700"
      style={{ width: `${result.resume_score}%` }}
    />
  </div>

  <p className="text-4xl font-bold mt-3">
    {result.resume_score}%
  </p>
</div>

<div className="bg-blue-100 rounded-xl p-6 shadow">
  <h2 className="text-xl font-bold text-blue-800">
    Job Match Score
  </h2>

  <div className="w-full bg-gray-300 rounded-full h-4 mt-4">
    <div
      className="bg-blue-600 h-4 rounded-full transition-all duration-700"
      style={{ width: `${result.job_match_score}%` }}
    />
  </div>

  <p className="text-4xl font-bold mt-3">
    {result.job_match_score}%
  </p>
</div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-green-700">
                ✅ Strengths
              </h2>

              <ul className="list-disc pl-5 space-y-2">
                {result.strengths?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-600">
                💡 Suggestions
              </h2>

              <ul className="list-disc pl-5 space-y-2">
                {result.suggestions?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
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

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
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
          <div className="mt-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-6">

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

          {Array.isArray(project.description) ? (

           project.description.map(
             (point: string, i: number) => (
               <li key={i}>
                 <ReactMarkdown>
                   {point}
                 </ReactMarkdown>
               </li>
             )
           )

         ) : (

           <li>
            <ReactMarkdown>
              {typeof project.description === "string"
                ? project.description
                : ""}
            </ReactMarkdown>
          </li>

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
<button
            onClick={downloadTailoredResume}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            ⬇ Download Tailored Resume PDF
          </button>
          </div>
        )}
       {coverLetter && (
  <div className="mt-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">

    <h2 className="text-3xl font-bold text-green-700 mb-6">
      📄 AI Generated Cover Letter
    </h2>

    <div className="bg-gray-100 rounded-lg p-6 whitespace-pre-wrap leading-8">
      {coverLetter}
    </div>

    <button
      onClick={() => copyText(coverLetter)}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      📋 Copy Cover Letter
    </button>

  </div>
)}

       {interviewResult && (

        <div className="mt-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">

        <h2 className="text-3xl font-bold text-orange-700 mb-6">

         🎤 AI Interview Coach

        </h2>

        <div className="space-y-6">

       {interviewResult.interview_questions?.map(
       (item:any,index:number)=>(

       <div
       key={index}
       className="border rounded-xl p-5 bg-gray-50 dark:bg-slate-700"
       >

       <div className="flex justify-between">

       <h3 className="text-xl font-bold">

       {item.category}

       </h3>

       <span className="font-semibold">

       {item.difficulty}

      </span>

      </div>

      <p className="mt-4 font-semibold">

       {item.question}

      </p>

      <div className="mt-4 bg-green-50 rounded-lg p-4">

      <p className="font-bold text-green-700">

      💡 Suggested Answer

      </p>

      <div className="mt-4 bg-green-50 rounded-lg p-4">
  <p className="font-bold text-green-700">
    💡 Easy Answer
  </p>

  <ReactMarkdown>
    {item.easy_answer}
  </ReactMarkdown>
</div>

<div className="mt-4 bg-blue-50 rounded-lg p-4">
  <p className="font-bold text-blue-700">
    🎯 Professional Answer
  </p>

  <ReactMarkdown>
    {item.professional_answer}
  </ReactMarkdown>
</div>

{item.star_answer && (
  <div className="mt-4 bg-yellow-50 rounded-lg p-4">
    <p className="font-bold text-orange-700">
      ⭐ STAR Answer
    </p>

    <p><b>Situation:</b> {item.star_answer.situation}</p>
    <p><b>Task:</b> {item.star_answer.task}</p>
    <p><b>Action:</b> {item.star_answer.action}</p>
    <p><b>Result:</b> {item.star_answer.result}</p>
  </div>
)}
     </div>

    </div>

)

)}

</div>

</div>

)}
<div className="mt-12 text-center text-sm text-gray-500">
Built with ❤️ using FastAPI • Next.js • Gemini AI
</div>
      </div>
    </main>
  );
}
