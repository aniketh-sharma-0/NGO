/** @type {import('tailwindcss').Config} */
export default {
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#1e3a8a', // Deep Navy (Blue 900) - Classic, trustworthy, professional
                accent: '#3b82f6', // Bright Blue (Blue 500) - For highlights
                secondary: '#10b981', // Emerald (Green 500) - For success/mission
                // Soft Backgrounds
                'soft-blue': '#eff6ff', // Blue 50
                'soft-green': '#f0fdf4', // green-50
            }
        },
    },
    plugins: [],
}
