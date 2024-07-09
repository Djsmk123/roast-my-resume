'use client';

import { useEffect, useState } from "react";
import { FaGithub } from 'react-icons/fa';
import { SlShare } from "react-icons/sl";
import BackgroundComponent from "../../components/background";
import ShareMenu from "@/components/share_button";
import RoastResponse from "@/model/roast_model";
import React from "react";
import DownloadImageComponent from "@/components/download_image";
import Typewriter from "@/components/typwriter";

const BASEURL = process.env.Backend_URL;
console.log("Base URL: ", BASEURL);

interface RoastPros {
    theme: string;
    roastResponse: RoastResponse | null;
}

export default function Home(props: RoastPros) {
    const [theme, setTheme] = useState(props.theme);
    const [shareOpen, setShareOpen] = useState(false);
    const [roastResponse, setRoastResponse] = useState<RoastResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        getRoast();
    }, []);

    async function getRoast() {
        setLoading(true);
        setError(null);
        setIsEmpty(false);

        try {
            const id = new URLSearchParams(window.location.search).get("id");
            console.log("ID: ", id);
            if (!id) {
                setIsEmpty(true);
                setLoading(false);
                return;
            }

            const data = localStorage.getItem("roastResponse?id=" + id);
            console.log("Data: ", data);
            if (!data) {
                // setRoastResponse(JSON.parse(data));
                // setLoading(false);
            } else {
                const response = await fetch(`${BASEURL}/roast/${id}`);
                if (response.ok) {
                    const roastData = await response.json();
                    const data = roastData["data"];
                    if (data) {
                        setRoastResponse(data);
                        localStorage.setItem("roastResponse?id=" + id, JSON.stringify(data));
                    } else {
                        setIsEmpty(true);
                    }
                } else {
                    setError("Failed to fetch roast data from the server.");
                }
                setLoading(false);
            }
        } catch (error) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    }

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (isEmpty || !roastResponse) {
            return <div>No roast found for the given ID.</div>;
        }

        return (
            <div>
                <div className={`mt-4 p-4 bg-${theme === "dark" ? "gray-800" : "black"} rounded-lg`}>
                    <h3 className={`mb-2 text-lg font-semibold text-${theme === "dark" ? "black" : "white"}`}>Roast Result</h3>
                    <Typewriter text={roastResponse.roast} />
                    {roastResponse.meme && roastResponse.meme.outputFull && roastResponse.meme.outputFull.html && (
                        <div className="mt-4 flex justify-center">
                            <DownloadImageComponent html={roastResponse.meme.outputFull.html} />
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-around" style={{ marginBottom: '0.8rem' }}>
                    <a
                        href="https://github.com"
                        className={`flex items-center text-${theme === "dark" ? "white" : "gray-500"} hover:text-${theme === "dark" ? "gray-400" : "gray-500"}`}
                    >
                        <FaGithub size={24} />
                        <span className="ml-2 text-sm">View on GitHub</span>
                    </a>
                    <p
                        onClick={() => setShareOpen(!shareOpen)}
                        className={`flex items-center text-${theme === "dark" ? "white" : "gray-500"} hover:text-${theme === "dark" ? "gray-400" : "gray-500"}`}
                    >
                        <SlShare size={24} />
                        <span className="ml-2 text-sm">Share</span>
                    </p>
                </div>
                {shareOpen && (
                    <ShareMenu roastResponse={roastResponse} />
                )}
            </div>
        );
    };

    return (
        <BackgroundComponent onThemeChange={(theme) => setTheme(theme)} child={renderContent()} />
    );
}
