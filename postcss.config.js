export default {
  plugins: {
    // Pin the Tailwind v4 (oxide) scanner base to this project directory.
    // On Windows, when the project lives on a different drive than the user
    // profile, the scanner can otherwise root automatic source detection at
    // C:\Users\<you> and crash (EPERM) on protected junctions like
    // "Application Data" / "Cookies".
    "@tailwindcss/postcss": { base: import.meta.dirname },
  },
};
