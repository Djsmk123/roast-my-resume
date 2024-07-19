'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { RoastLevel, RoastStatus, RoleType, Languages } from "../utils/constants";
import { submitRoastRequest, getRoastCount } from "../services/roast_service";
import Switch from '@mui/material/Switch';
import React from "react";
import BackgroundComponent from '@/components/background';
import { FaGithub, FaTelegram } from 'react-icons/fa';
import { useTheme } from '@/components/theme';
import TermsCondition from '@/components/terms_condition';
enum RoastType {
  Resume = "My Resume",
  LinkedIn = "My LinkedIn Profile"
}


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

  const [linkedInProfileUrl, setLinkedInProfileUrl] = useState("");
  const [roastStatus, setRoastStatus] = useState(RoastStatus.initial);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roastLevel, setRoastLevel] = useState("dark");
  const [roleType, setRoleType] = useState("friend");
  const [language, setLanguage] = useState("english");
  const [roastCount, setRoastCount] = useState(0);
  const [useImageGenerator, setUseImageGenerator] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [consent, setConsent] = useState(false);
  const theme = useTheme().theme;
  const [roastType, setRoastType] = useState("My Resume");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLinkedInProfileUrl(e.target.value);
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
  const handleRoastTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoastType = e.target.value as RoastType;
    setRoastType(selectedRoastType);

    if (selectedRoastType === RoastType.Resume) {
      setLinkedInProfileUrl("");
    } else {
      setSelectedFile(null);
    }
  };


  const handleRoleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleType(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    //check if user has already agreed to terms
    const agreed = localStorage.getItem("agreed");
    //open terms if user has not agreed
    if (!agreed) {
      setOpenTerms(true);
    }
    getRoastCount((count: any) => setRoastCount(count));
  }, [roastStatus]);

  const handleSubmit = async () => {
    if (roastStatus === RoastStatus.loading) return;
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
    if (!linkedInProfileUrl && !selectedFile) {
      alert("Please provide a LinkedIn profile url or resume file");
      return;
    }
    //check if valid linkedin profile url
    if (roastType === RoastType.LinkedIn && !linkedInProfileUrl.includes("linkedin.com/in/")) {
      alert("Please provide a valid LinkedIn profile url");
      return;
    }


    try {
      setRoastStatus(RoastStatus.loading);
      const res = await submitRoastRequest(
        roastLevel,
        roleType,
        linkedInProfileUrl,
        selectedFile,
        language,
        useImageGenerator,
      );

      setRoastCount((prevCount: number) => {
        const newCount = prevCount + 1;
        localStorage.setItem("roastCount", newCount.toString());
        localStorage.setItem("roastCountTimestamp", Date.now().toString());
        return newCount;
      });
      router.push("/roast?id=" + res?.id);
    } catch (e) {
      setRoastStatus(RoastStatus.error);
      alert("An error occurred while submitting roast request");
    }
  };



  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  const handleAgree = () => {
    //store agreement in local storage
    localStorage.setItem("agreed", "true");
    setConsent(true);
    setOpenTerms(false);
  };

  return (
    <BackgroundComponent
      child={(
        <div>
          {roastStatus !== RoastStatus.success && (
            <div className="mb-4">
              <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                Total Roasts: <AnimatedCounter end={roastCount} />
              </p>
            </div>
          )}

          <div>
            {roastStatus !== RoastStatus.success && (
              <div className="mb-4">
                <label htmlFor="roastType" className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Roast Type</label>
                <select
                  id="roastType"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"}`}
                  value={roastType}
                  onChange={handleRoastTypeChange}
                >
                  {Object.entries(RoastType).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>

                <div className="w-full" style={{ marginTop: '1rem' }}>
                  {roastType === RoastType.LinkedIn && (
                    <textarea
                      id="resumeText"
                      className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "black"} placeholder-gray-400`}
                      rows={1}
                      value={linkedInProfileUrl}
                      onChange={handleTextChange}
                      placeholder="LinkedIn Profile url "
                    ></textarea>
                  )}
                </div>
                {roastType === RoastType.Resume && (
                  <div className="w-full">
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${theme === "dark" ? "dark" : ""}`}
                    />
                  </div>
                )}
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
                {useImageGenerator && (
                  <div className='text-sm font-medium text-red-500'>
                    Using the image generator will take longer to process your request.
                  </div>
                )}
              </div>
            )}
            {roastStatus === RoastStatus.loading && (
              <div className="flex justify-center mt-4">
                <ClipLoader color="#00BFFF" loading={true} size={30} />
              </div>
            )}
            <div className="mt-4">
              <button
                className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md ${roastStatus === RoastStatus.success ? "hidden" : ""}`}
                onClick={handleSubmit}
                style={{
                  marginBottom: '0.8rem',
                  margin: 'auto',
                  justifyContent: 'center',
                  width: '30%',
                  display: 'block',

                }}
                disabled={roastStatus === RoastStatus.loading}
              >
                {roastStatus === RoastStatus.initial || roastStatus === RoastStatus.error
                  ? "Submit For Roast"
                  : "Roasting..."}
              </button>
            </div>
            <div className="mt-4 flex justify-around" style={{ marginBottom: '0.8rem' }}>
              <a
                href="https://github.com/Djsmk123/roast-my-resume"
                target="_blank"
                className={`flex items-center text-${theme === "dark" ? "white" : "gray-500"} hover:text-${theme === "dark" ? "gray-400" : "gray-500"}`}
              >
                <FaGithub size={24} />
                <span className="ml-2 text-sm">View on GitHub</span>
              </a>
              <a
                href="https://t.me/NotifyMeRoastBot"
                target="_blank"
                className={`flex items-center text-${theme === "dark" ? "white" : "gray-500"} hover:text-${theme === "dark" ? "gray-400" : "gray-500"}`}
              >
                <FaTelegram size={24} />
                <span className="ml-2 text-sm">Now available on Telegram</span>
              </a>
            </div>
          </div>

          <TermsCondition
            openTerms={openTerms}
            theme={theme}
            handleAgree={handleAgree}
            handleCloseTerms={handleCloseTerms}
            consent={consent}
            setConsent={setConsent}
          />




        </div>
      )}
    >
    </BackgroundComponent>
  );
}
