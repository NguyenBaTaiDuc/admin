/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "montserrat-regular": ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "custom-sidebar":
          "linear-gradient(to bottom left, #FDCE1C 2%, #FE881C 10%, #FE881C 80%, #FDCE1C 100%)",
      },
      colors: {
        primary: "#FF760E",
        "primary-th1": "#FDCE1C",
        "primary-th2": "#C14600",
        "primary-black": "#262632",
        "primary-gray-th1": "#e5e7eb",
        pending: "#FFA500",
        cancelled: "#FF0000",
        processing: "#00BFFF",
        delivered: "#008000",
        delivering: "#1E90FF",
        packed: "#FFD700",
        off: "#A9A9A9",

        recipe: "#FDF79A",
        "recipe-bg": "#FAED37",
        "dashboard-red": "#EC221F",
        "dashboard-yellow": "#FFB200",
        "dashboard-blue": "#3AA6CA",
        "dashboard-green": "#03695E",
        "dashboard-violet": "#77279A",
      },
    },
    keyframes: {
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      bounce: {
        "0%, 100%": {
          transform: "translateX(-10%)",
          animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
        },
        "50%": {
          transform: "translateX(0)",
          animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
        },
      },
      hueRotate: {
        "0%": { filter: "hue-rotate(0deg)" },
        "100%": { filter: "hue-rotate(360deg)" },
      },
      "slide-bottom": {
        "0%": {
          transform: "translateY(0)",
        },
        to: {
          transform: "translateY(-5px)",
        },
      },
    },
    animation: {
      "slide-bottom":
        "slide-bottom 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      hueRotate: "hueRotate 5s infinite linear",
      "spin-slow": "spin 3s linear infinite",
      "spin-fast": "spin 1s linear infinite",
      "bounce-slow": "bounce 2s infinite",
    },
  },
  plugins: [],
};
