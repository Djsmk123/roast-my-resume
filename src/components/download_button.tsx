import { FaDownload } from "react-icons/fa";
import { useRef, useState, } from "react";
import {
    exportComponentAsJPEG,

} from "react-component-export-image";
import React from "react";

export default function DownloadButton(
    roastText: string,
    isDialogOpen: boolean,
    setIsDialogOpen: (value: boolean) => void
) {



    return (
        <div>
            <div className="mb-4">
                <button
                    onClick={() => {
                        //open the dialog
                        setIsDialogOpen(true);

                        // Handle save logic here


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
            {isDialogOpen && <DownloadButtonDialog roastText={roastText} onCloseDialog={function (): void {
                setIsDialogOpen(false);
            }} />}


        </div>
    );
}



interface DownloadButtonProps {
    roastText: string;
}

interface DownloadButtonProps {
    roastText: string;
    onCloseDialog: () => void;
}

const DownloadButtonDialog: React.FC<DownloadButtonProps> = ({ roastText, onCloseDialog }) => {

    const componentRef = useRef<HTMLDivElement | null>(null);
    const [isDownloadButtonDisabled, setIsDownloadButtonDisabled] = useState(false);

    const handleSave = async () => {
        setIsDownloadButtonDisabled(true);

        exportComponentAsJPEG(componentRef).then(() => {
            //fake delay
            setTimeout(() => {
                setIsDownloadButtonDisabled(false);
                onCloseDialog();
            }, 2000);

        });

    };

    return (
        <React.Fragment>
            <div
                ref={componentRef}
                className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50"
                style={{ flexDirection: "column-reverse" }} // Align from bottom
            >
                <div className="relative w-full max-w-md p-8 bg-gradient-to-br from-blue-500 to-red-700 rounded-lg shadow-lg">
                    <div className="absolute bottom-0 right-0 m-4">
                        <a
                            href="https://roast-my-resume.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.5rem" }}
                            className="text-white hover:text-gray-200"
                        >
                            *Powered by https://roast-my-resume.vercel.app/
                        </a>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-white mb-6">Your Roast </p>
                        <p className="text-white">{roastText}</p>
                    </div>
                    {!isDownloadButtonDisabled && (
                        <div className="mt-6">
                            <button
                                onClick={handleSave}
                                style={{
                                    marginBottom: "0.5rem",
                                }}
                                className="w-full px-4 py-2 text-white bg-transparent rounded-md hover:bg-transparent flex items-center justify-center border border-white"
                            >
                                <FaDownload className="mr-2" />
                                Save Roast
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};



