import { toPng } from "html-to-image";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface DownloadImageProps {
    html: string;
}

const DownloadImageComponent: React.FC<DownloadImageProps> = ({ html }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const convertToImage = async () => {
            if (componentRef.current) {
                setLoading(true);
                try {
                    const dataUrl = await toPng(componentRef.current);
                    setImageUrl(dataUrl);
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to convert HTML to image', error);
                    setError('Failed to convert HTML to image');
                    setLoading(false);
                }
            }
        };

        convertToImage();
    }, [html]);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        // Handle context menu action if needed
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div
                    ref={componentRef}
                    className="flex items-center justify-center"
                    style={{ marginBottom: "20px", display: imageUrl ? 'none' : 'block' }}
                    dangerouslySetInnerHTML={{ __html: html }}
                    onContextMenu={handleContextMenu}
                />
            )}
            {imageUrl && (
                <div className="flex items-center justify-center">
                    <img
                        width="50%"
                        height="50%"
                        src={imageUrl} alt="Downloaded Image" />
                </div>
            )}
        </div>
    );
};

export default DownloadImageComponent;