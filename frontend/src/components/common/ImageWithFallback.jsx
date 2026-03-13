import React, { useState, useEffect } from 'react';

// A minimal SVG placeholder (grey background with 'No Image' text) as a Data URI to ensure 100% availability.
const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23e2e8f0' width='800' height='400'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

const ImageWithFallback = ({ src, alt, className, fallbackSrc = DEFAULT_PLACEHOLDER }) => {

    const getSanitizedSrc = (url) => {
        if (!url || typeof url !== 'string') return fallbackSrc;
        let cleanUrl = url.trim();

        // If it's a web URL or Data URI, return as is
        if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:')) return cleanUrl;

        // Fix Windows paths (replace backslashes)
        cleanUrl = cleanUrl.replace(/\\/g, '/');

        // Ensure relative paths start with /
        if (!cleanUrl.startsWith('/')) {
            cleanUrl = `/${cleanUrl}`;
        }
        return cleanUrl;
    };

    const initialSrc = getSanitizedSrc(src);
    const [imgSrc, setImgSrc] = useState(initialSrc);
    // Track if we are already showing the fallback to avoid infinite loops if fallback also fails
    const [isShowingFallback, setIsShowingFallback] = useState(initialSrc === fallbackSrc);

    const handleError = () => {
        if (!isShowingFallback) {
            // First failure: Try the provided fallback
            setImgSrc(fallbackSrc);
            setIsShowingFallback(true);
        } else if (imgSrc !== DEFAULT_PLACEHOLDER) {
            // Second failure (fallback failed): Show the ultimate safety net
            setImgSrc(DEFAULT_PLACEHOLDER);
        }
    };

    // Reset state if props change
    React.useEffect(() => {
        const newSrc = getSanitizedSrc(src);
        setImgSrc(newSrc);
        setIsShowingFallback(newSrc === fallbackSrc);
    }, [src, fallbackSrc]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
