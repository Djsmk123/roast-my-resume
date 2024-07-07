import { toPng } from "html-to-image";
import React from "react";
import { useRef } from "react";

const DownloadImageComponent: React.FC<{ html: string }> = ({ html }) => {
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleContextMenu = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (componentRef.current) {
            try {
                const dataUrl = await toPng(componentRef.current);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'downloaded-image.png';
                link.click();
            } catch (error) {
                console.error('Failed to download image', error);
            }
        }
    };

    return (
        <React.Fragment>
            <div
                ref={componentRef}
                className="flex items-center justify-center"
                style={{ marginBottom: "20px" }}
                dangerouslySetInnerHTML={{ __html: html }}
                onContextMenu={handleContextMenu}
            />
        </React.Fragment>
    );
};
export default DownloadImageComponent;