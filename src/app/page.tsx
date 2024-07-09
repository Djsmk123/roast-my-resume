'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

import { ClipLoader } from "react-spinners";

import { RoastLevel, RoastStatus, RoleType, Languages } from "../utils/constants";
import { submitRoastRequest, getRoastCount } from "../services/roast_service";
import Switch from '@mui/material/Switch';
import RoastResponse from "@/model/roast_model";
import React from "react";
import BackgroundComponent from '@/components/background';
import { stat } from 'fs';


const BASEURL = process.env.Backend_URL;
console.log("Base URL: ", BASEURL);







const AnimatedCounter: React.FC<{ end: number }> = ({ end }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 20);

    const counter = setInterval(() => {
      start += increment;
      setCount(Math.min(end, Math.round(start)));
      if (start >= end) clearInterval(counter);
    }, 20);

    return () => clearInterval(counter);
  }, [end]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Home() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [roastStatus, setRoastStatus] = useState(RoastStatus.initial);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roastLevel, setRoastLevel] = useState("dark");
  const [roleType, setRoleType] = useState("friend");
  const [language, setLanguage] = useState("english");
  const [roastCount, setRoastCount] = useState(0);
  const [useImageGenerator, setUseImageGenerator] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRoastLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;
    setRoastLevel(level);
    if (level === 'vulgar') {
      setUseImageGenerator(false);
    }
  };

  const handleRoleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleType(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };



  useEffect(() => {

    if (roastStatus === RoastStatus.initial) {
      getRoastCount((count: any) => setRoastCount(count));
    }
  }, [roastStatus]);



  const handleSubmit = async () => {
    // Prevent multiple requests
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
    if (roleType === "") {
      alert("Please select a role type");
      return;
    }
    if (language === "") {
      alert("Please select a language");
      return;
    }

    if (!resumeText && !selectedFile) {
      alert("Please provide a file or resume text");
      return;
    }
    try {
      setRoastStatus(RoastStatus.loading);
      const res = await submitRoastRequest(
        roastLevel,
        roleType,
        resumeText,
        selectedFile,
        language,
        useImageGenerator,
      );
      localStorage.setItem("roastResponse?id=" + res?.id, JSON.stringify(res?.id));
      setRoastCount((prevCount: number) => {
        const newCount = prevCount + 1;
        localStorage.setItem("roastCount", newCount.toString());
        localStorage.setItem("roastCountTimestamp", Date.now().toString());
        return newCount;
      });
      router.push("/roast?id=" + res?.id,);
    } catch (e) {
      setRoastStatus(RoastStatus.error);
      alert("An error occurred while submitting roast request");
    }
  };

  return (
    <BackgroundComponent
      onThemeChange={(theme) => setTheme(theme)}
      child={(
        <div>
          {roastStatus !== RoastStatus.success && (
            <div className="mb-4">
              <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Total Roasts: <AnimatedCounter end={roastCount} /></p>
            </div>
          )}
          {roastStatus !== RoastStatus.success && (
            <div className="mb-4 flex flex-col items-center">
              <div className="w-full">
                <label htmlFor="resumeText" className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Text-based Roast</label>
                <textarea
                  id="resumeText"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"} placeholder-gray-400`}
                  rows={4}
                  value={resumeText}
                  onChange={handleTextChange}
                  placeholder="Enter text here..."
                ></textarea>
              </div>
              <div className="my-2">
                <p className={`text-sm font-medium text-center ${theme === "dark" ? "text-white" : "text-black"}`}>OR</p>
              </div>
              <div className="w-full">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${theme === "dark" ? "dark" : ""}`}
                />
              </div>
            </div>

          )}
          {roastStatus !== RoastStatus.success && (
            <div>
              <div className="mb-4">
                <label htmlFor="roastLevel" className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Roast Level</label>
                <select
                  id="roastLevel"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"}`}
                  value={roastLevel}
                  onChange={handleRoastLevelChange}
                >
                  {Object.entries(RoastLevel).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="roleType" className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Role Type</label>
                <select
                  id="roleType"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"}`}
                  value={roleType}
                  onChange={handleRoleTypeChange}
                >

                  {Object.entries(RoleType).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="language" className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Language</label>
                <select
                  id="language"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"}`}
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {Object.entries(Languages).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <Switch
                  checked={useImageGenerator}
                  onChange={(e) => setUseImageGenerator(e.target.checked)}
                  color="primary"
                />
                <p className={`ml-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Use Image Generator</p>
              </div>
            </div>
          )}


          {roastStatus === RoastStatus.loading && (
            <div className="flex justify-center mt-4">
              <ClipLoader color="#00BFFF" loading={true} size={150} />
            </div>
          )}
          <div className="mt-4">
            <button
              className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md ${roastStatus === RoastStatus.success ? "hidden" : ""}`}
              onClick={handleSubmit}
              disabled={roastStatus === RoastStatus.loading}
            >
              {roastStatus === RoastStatus.initial || roastStatus === RoastStatus.error
                ? "Submit Roast"
                : "Roasting..."}
            </button>

          </div>
        </div>
      )}
    >

    </BackgroundComponent>
  );
}

