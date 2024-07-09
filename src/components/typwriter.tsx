import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullText, setShowFullText] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <ReactMarkdown>{text}</ReactMarkdown>
    );

    // useEffect(() => {
    //     let interval: NodeJS.Timeout | undefined;

    //     if (!showFullText) {
    //         interval = setInterval(() => {
    //             if (currentIndex < text.length) {
    //                 setDisplayText((prevText) => prevText + text[currentIndex]);
    //                 setCurrentIndex((prevIndex) => prevIndex + 1);
    //             } else {
    //                 clearInterval(interval as NodeJS.Timeout);
    //                 setShowFullText(true); // Show full text once typewriter effect completes
    //             }
    //         }, 20);
    //     }

    //     return () => {
    //         if (interval) clearInterval(interval);
    //     };
    // }, [currentIndex, showFullText, text]);

    // // Handle toggle between collapsed and expanded state
    // const toggleCollapse = () => {
    //     setIsCollapsed(!isCollapsed);
    //     if (!isCollapsed) {
    //         setShowFullText(false); // Reset to truncate text when collapsing
    //     }
    // };

    // // Handle click on "Read More" to show full text
    // const handleReadMore = () => {
    //     setShowFullText(true);
    //     setIsCollapsed(false); // Expand text when clicking Read More
    // };

    // // Split text into lines (assuming each '\n' is a line break)
    // const lines = text.split("\n");

    // // Display first 4 lines or all lines if showFullText is true
    // const displayLines = showFullText ? lines : lines.slice(0, 4);

    // return (
    //     <>
    //         {displayLines.map((line, index) => (
    //             <ReactMarkdown key={index}>{line}</ReactMarkdown>
    //         ))}
    //         {!showFullText && (
    //             <span className="cursor-pointer text-blue-500 hover:underline" onClick={handleReadMore}>
    //                 ... Read More
    //             </span>
    //         )}
    //         {!isCollapsed && (
    //             <span className="cursor-pointer text-blue-500 hover:underline" onClick={toggleCollapse}>
    //                 ... Collapse
    //             </span>
    //         )}
    //     </>
    // );
};
export default Typewriter;