"use client";

import { Switch } from "@mui/material";
import { Analytics } from "@vercel/analytics/next";
import { useState } from "react";
interface BackgroundComponentProps {
    child: React.ReactNode;
    onThemeChange: (theme: string) => void;

}
const BackgroundComponent = ({ child, onThemeChange }: BackgroundComponentProps) => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
        onThemeChange(theme === "light" ? "dark" : "light");
    };
    return (
        <main className={`flex min-h-screen items-center justify-center bg-${theme === "dark" ? "gray-900" : "white"} text-${theme === "dark" ? "white" : "black"}`}>
            <div className={`w-full max-w-5xl p-8 ${theme === "dark" ? "dark" : ""}`}>
                <Analytics />
                <div className={`relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]`}></div>
                <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
                <div className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 ${theme === "dark" ? "dark" : "hover:bg-gray-100"}`}>

                    <div className="flex justify-between items-center">
                        <h2 className={`mb-3 text-2xl font-semibold text-${theme === "dark" ? "blue-500" : "black"}`}>Roast My Resume</h2>
                        <div className="flex items-center">
                            <p className={`mr-2 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Dark Mode</p>
                            <Switch
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                                color="default"
                            />
                        </div>
                    </div>
                    {child}







                </div>


            </div>
        </main>
    );
}
export default BackgroundComponent;