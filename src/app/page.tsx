"use client";
import { useEffect, useState } from "react";
import { FaGithub } from 'react-icons/fa';

import { ClipLoader } from "react-spinners";

enum RoastLevel {
  soft = "Soft-hearted",
  hard = "Hard-hearted",
  light = "Light",
  dark = "Dark",
  vulgar = "Vulgar",
}

enum RoastStatus {
  success = "Success",
  error = "Error",
  loading = "Loading",
  initial = "Initial",
}

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulate typewriter effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const interval = setInterval(() => {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);

        if (currentIndex === text.length - 1) {
          clearInterval(interval);
        }
      }, 20); // Adjust typing speed (ms)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
};




export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [roastStatus, setRoastStatus] = useState(RoastStatus.initial);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roastLevel, setRoastLevel] = useState("dark");
  const [roastText, setRoastText] = useState("");

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

  const handleSubmit = async () => {
    if (roastStatus === RoastStatus.loading) {
      return;
    }
    if (roastStatus === RoastStatus.success) {
      setRoastStatus(RoastStatus.initial);
      return;
    }
    if (roastLevel === "") {
      alert("Please select a roast level");
      return;
    }

    if (!resumeText && !selectedFile) {
      alert("Please provide a file or resume text");
      return;
    }

    const formData = new FormData();
    const roastIndex = Object.keys(RoastLevel).indexOf(roastLevel);
    formData.append("roastLevel", roastIndex.toString());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    if (resumeText) {
      formData.append("textBasedResume", resumeText);
    }
    setRoastStatus(RoastStatus.loading);
    //fake fetch

    await fetch("/api/roast", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 1,
      }
    })
      .then(async (response) => {
        var data = await response.json();
        if (response.ok) {
          return data;
        }

        throw new Error(data.message);
      })
      .then((data) => {
        console.log(data);

        setRoastStatus(RoastStatus.success);
        setRoastText(data.message);
        alert("Roast generated successfully!");
      })
      .catch((error) => {
        setRoastStatus(RoastStatus.error);
        alert("An error occurred. Please try again later.");
      });

  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-5xl p-8">
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Roast My  Resume</h2>
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

          <div className="mt-8 text-center text-gray-400 text-sm " style={{

            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}>




            <a href="https://github.com/djsmk123" target="_blank" rel="noopener noreferrer" className="ml-2">
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
