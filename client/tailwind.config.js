export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        surface: "#080B13",
        panel: "rgba(15, 23, 42, 0.72)"
      },
      boxShadow: {
        glow: "0 0 45px rgba(99, 102, 241, 0.28)"
      }
    }
  },
  plugins: []
};
