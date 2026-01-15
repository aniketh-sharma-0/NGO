/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // Blue (60%)
                secondary: '#16a34a', // Green (10%)
                // White is default background (60%)
            }
        },
    },
    plugins: [],
}
