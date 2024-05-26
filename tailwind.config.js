/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-blue": "#F5F6F8",
        "main-1": "#6AC9E5",
        "main-2": "#87D3EA",
        "main-3": "#74B2CB",
        "main-4": "#E4F3F8",
        "main-5": "#C8E6F2",
        "text-1": "#222222",
        "text-2": "#666666",
        "text-3": "#4D7787",
        "gray-1": "#E5E5E5",
        "gray-2": "#EEEEEE",
        "gray-3": "#F5F5F5",
        "gray-4": "#F2F2F2",
        "gray-f-6": "#F6F6F6",
        "brown-1": "#6B4A42",
        white: "#FFFFFF",
        "white-1": "#FEFEFE",
        "red-1": "#E53E3E",
        "toast-error": "#F17D71",
        "toast-success": "#B1DCED",
      },
      fontFamily: {
        Jalnan: ["Jalnan2TTF"],
        Pretendard: ["Pretendard"],
      },
    },
  },
  plugins: [],
};
