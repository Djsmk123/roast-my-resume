"use client";
import { useEffect, useState } from "react";
import { FaGithub } from 'react-icons/fa';
import { ClipLoader } from "react-spinners";
import { Analytics } from "@vercel/analytics/react";
import ReactMarkdown from "react-markdown";
import { RoastLevel, RoastStatus, RoleType, Languages } from "../utils/constants";
import { submitRoastRequest, getRoastCount } from "../services/roast_service";
import DownloadButton from "../components/download_button";



const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(typeof window !== 'undefined' ? 0 : null);


  // Simulate typewriter effect
  useEffect(() => {
    if (currentIndex !== null && currentIndex < text.length) {
      const interval = setInterval(() => {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : null));

        if (currentIndex === text.length - 1) {
          clearInterval(interval);
        }
      }, 20); // Adjust typing speed (ms)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [currentIndex, text]);

  return <ReactMarkdown>{displayText}</ReactMarkdown>;

};

const AnimatedCounter: React.FC<{ end: number }> = ({ end }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds duration
    const increment = end / (duration / 20); // Calculate increment based on duration

    const counter = setInterval(() => {
      start += increment;
      setCount(Math.min(end, Math.round(start))); // Ensure it does not exceed end value
      if (start >= end) clearInterval(counter);
    }, 20);

    return () => clearInterval(counter);
  }, [end]);

  return <span>{count.toLocaleString()}</span>; // Format number with commas
};

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [roastStatus, setRoastStatus] = useState(RoastStatus.initial);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roastLevel, setRoastLevel] = useState("dark");
  const [roleType, setRoleType] = useState("friend");
  const [language, setLanguage] = useState("english");
  const [roastText, setRoastText] = useState("");
  const [roastCount, setRoastCount] = useState(0);


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRoastLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoastLevel(e.target.value);
  };

  const handleRoleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleType(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };


  useEffect(() => {
    return getRoastCount((count: any) => setRoastCount(count));
  }, []);

  const handleSubmit = async () => {
    submitRoastRequest(
      roastLevel,
      roleType,
      roastStatus,
      setRoastStatus,
      setRoastText,
      () => roastCount,
      resumeText,
      selectedFile,
      language,
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-5xl p-8">
        <Analytics />
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Roast My Resume</h2>
          <div className="mb-4">
            <p className="text-sm font-medium">Total Roasts: <AnimatedCounter end={roastCount} /></p>
          </div>
          {roastStatus !== RoastStatus.success && (
            <div>
              <div className="mb-4">
                <label htmlFor="resumeText" className="block mb-2 text-sm font-medium">
                  Text-based Roast
                </label>
                <textarea
                  id="resumeText"
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
                  rows={4}
                  value={resumeText}
                  onChange={handleTextChange}
                  placeholder="Enter text here..."
                ></textarea>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-0.5 bg-gray-700"></div>
                  <div className="px-3 text-sm text-gray-400">OR</div>
                  <div className="flex-1 h-0.5 bg-gray-700"></div>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="resumeFile" className="block mb-2 text-sm font-medium">
                  File Upload Roast
                </label>
                <input
                  type="file"
                  id="resumeFile"
                  className="w-full py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="roastLevel" className="block mb-2 text-sm font-medium">
                  Roast Level
                </label>
                <select
                  id="roastLevel"
                  className="w-full py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  value={roastLevel}
                  onChange={handleRoastLevelChange}
                >
                  <option value="">Select Roast Level</option>
                  {Object.entries(RoastLevel).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="roleType" className="block mb-2 text-sm font-medium">
                  Role Type
                </label>
                <select
                  id="roleType"
                  className="w-full py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  value={roleType}
                  onChange={handleRoleTypeChange}
                >
                  <option value="">Select Role Type</option>
                  {Object.entries(RoleType).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="language" className="block mb-2 text-sm font-medium">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="">Select Language</option>
                  {Object.entries(Languages).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {roastStatus === RoastStatus.success && (
            <div className="text-center mt-4" style={{
              padding: "10px",
              margin: "10px",
            }}>
              <Typewriter text={roastText} />
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center"
              style={{
                width: "20%", // Set width to 50%
                margin: "0 auto", // Center align horizontally
              }}
              disabled={roastStatus === RoastStatus.loading}
            >
              {roastStatus === RoastStatus.loading ? (
                <ClipLoader color={"#ffffff"} loading={true} size={20} />
              ) : (
                roastStatus === RoastStatus.success ? "Roast Again" :
                  "Roast Now"
              )}
            </button>
          </div>
          {roastStatus === RoastStatus.success && (
            <DownloadButton
              roastText={roastText}


            />

          )}

          <div className="mt-8 text-center text-gray-400 text-sm " style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}>
            <a href="https://github.com/Djsmk123/roast-my-resume" target="_blank" rel="noopener noreferrer" className="ml-2">
              <FaGithub size={20} className="text-gray-400 hover:text-gray-600" />
            </a>
            <p className="mt-4" style={{
              paddingBottom: "15px",
              paddingLeft: "10px",
            }}>Made with ❤️ by <a href="">smkwinner</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
