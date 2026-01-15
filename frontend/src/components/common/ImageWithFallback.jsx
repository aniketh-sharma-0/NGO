import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc = 'https://via.placeholder.com/400x300?text=No+Image' }) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    // Update state if prop changes
    React.useEffect(() => {
        setImgSrc(src || fallbackSrc);
        setHasError(false);
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
