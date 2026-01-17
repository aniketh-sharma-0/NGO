/**
 * Resolves the image URL.
 * If it's a relative path (starts with /), it prepends the backend URL (or leaves it for proxy).
 * If it's a full URL, it returns it as is.
 * @param {string} path 
 * @returns {string}
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // In dev, proxy handles it. In prod, we might need full URL.
    // For now, assuming proxy or relative path works.
    return path;
};
