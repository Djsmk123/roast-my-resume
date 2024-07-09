"use client";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { SlShare } from "react-icons/sl";
import BackgroundComponent from "../../components/background";
import ShareMenu from "@/components/share_button";
import RoastResponse from "@/model/roast_model";
import React from "react";
import DownloadImageComponent from "@/components/download_image";
import Typewriter from "@/components/typwriter";
import { useTheme } from "@/components/theme";
import { getRoastById } from "@/services/roast_service";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

const BASEURL = process.env.Backend_URL;
console.log("Base URL: ", BASEURL);

export default function Home() {
    const { theme } = useTheme();

    const [roastResponse, setRoastResponse] = useState<RoastResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEmpty, setIsEmpty] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [shareOpen, setShareOpen] = useState(false);

    useEffect(() => {
        getRoast();
    }, []);

    async function getRoast() {
        setLoading(true);
        setError(null);
        setIsEmpty(false);

        try {
            const id = new URLSearchParams(window.location.search).get("id");
            if (!id) {
                setError("Please provide a valid roast id.");
                setLoading(false);
                return;
            }
            const data = localStorage.getItem("roastResponse?id=" + id);
            console.log("Data: ", data);

            if (data) {
                setRoastResponse(JSON.parse(data));
                setLoading(false);
            } else {
                const data = await getRoastById(id);
                if (data) {
                    setRoastResponse(data);
                    setLoading(false);
                } else {
                    setIsEmpty(true);
                    setLoading(false);
                }
            }
        } catch (error) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    }

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Alert severity="error">{`Error: Something went wrong. Please try again later.`}</Alert>
                </Box>
            );
        }

        if (isEmpty || !roastResponse) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Alert severity="warning">{"No roast found. Please try again later."}</Alert>
                </Box>
            );
        }

        return (
            <Box mt={4} p={4} className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} borderRadius={1}>
                <Typography variant="h5" mb={2} fontWeight="fontWeightBold">Roast Result</Typography>
                <Typewriter text={roastResponse.roast} />
                {roastResponse.meme && roastResponse.meme.outputFull && roastResponse.meme.outputFull.html && (
                    <Box mt={4} display="flex" justifyContent="center">
                        <DownloadImageComponent
                            afterDownload={(url) => setImageUrl(url)}
                            html={roastResponse.meme.outputFull.html}
                        />
                    </Box>
                )}

                <Box mt={2} display="flex" justifyContent="space-around" mb={1}>
                    <a
                        href="https://github.com/Djsmk123/roast-my-resume"
                        className={`flex items-center ${theme === "dark" ? "text-white hover:text-gray-400" : "text-gray-500 hover:text-gray-500"}`}
                    >
                        <FaGithub size={24} />
                        <Typography variant="body2" ml={1}>View on GitHub</Typography>
                    </a>
                    <Typography
                        onClick={() => setShareOpen(!shareOpen)}
                        className={`flex items-center ${theme === "dark" ? "text-white hover:text-gray-400" : "text-gray-500 hover:text-gray-500"}`}
                    >
                        <SlShare size={24} />
                        <Typography variant="body2" ml={1}>Share</Typography>
                    </Typography>
                </Box>
                {shareOpen && <ShareMenu roastResponse={roastResponse} imageUrl={imageUrl} />}
            </Box>
        );
    };

    return (
        <BackgroundComponent child={renderContent()} />
    );
}
