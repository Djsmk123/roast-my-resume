"use client";
import { FaDownload } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import React from "react";

export default function DownloadButton(props: DownloadButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { roastText } = props;

    return (
        <div>
            <div className="mb-4">
                <button
                    onClick={() => {
                        // Open the dialog
                        setIsDialogOpen(true);
                    }}
                    className="w-full px-4 py-2 text-white bg-transparent rounded-md hover:bg-tranparent flex items-center justify-center"
                    style={{
                        width: "20%", // Set width to 50%
                        margin: "0 auto", // Center align horizontally
                    }}
                >
                    <FaDownload style={{ marginRight: "0.5rem" }} />
                    Save Roast
                </button>
            </div>
            {isDialogOpen && (
                <DownloadButtonDialog roastText={roastText} />
            )}
        </div>
    );
}

interface DownloadButtonProps {
    roastText: string;
}

const DownloadButtonDialog: React.FC<DownloadButtonProps> = ({ roastText }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false); // Use isDownloading for state

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Check if the component is being rendered on the client side
        setIsClient(true);
    }, []);

    const handleSave = async () => {
        setIsDownloading(true);

        if (componentRef.current) {
            await exportComponentAsJPEG(componentRef).then(() => {
                // Download complete (handle as needed)
                setIsDownloading(false); // Set state to false after download finishes
            });
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <React.Fragment>
            <div
                ref={componentRef}
                className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50"
                style={{ flexDirection: 'column-reverse' }} // Align from bottom
            >
                <div className="relative w-full max-w-md p-8 bg-gradient-to-br from-blue-500 to-red-700 rounded-lg shadow-lg">
                    <div className="absolute bottom-0 right-0 m-4">
                        <a
                            href="https://roast-my-resume.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.5rem' }}
                            className="text-white hover:text-gray-200"
                        >
                            *Powered by https://roast-my-resume.vercel.app/
                        </a>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-white mb-6">Your Roast</p>
                        <p className="text-white">{roastText}</p>
                    </div>
                    {!isDownloading && (
                        <div className="mt-6">
                            <button
                                onClick={handleSave}
                                style={{
                                    marginBottom: '0.5rem',
                                }}
                                className="w-full px-4 py-2 text-white bg-transparent rounded-md hover:bg-transparent flex items-center justify-center border border-white"
                            >
                                <FaDownload className="mr-2" />
                                Save Roast
                            </button>
                        </div>
                    )}
                    {isDownloading && ( // Show a message while downloading
                        <p className="text-white mt-4">Download in progress...</p>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
