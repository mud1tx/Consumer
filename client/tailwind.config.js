// module.exports = {
//   future: {
//     // removeDeprecatedGapUtilities: true,
//     // purgeLayersByDefault: true,
//   },
//   purge: [],
//   theme: {
//     extend: {},
//   },
//   variants: {},
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
    main_color:{
  1000:"#344e41",
  800:"#3a5a40",
  600:"#588157",
  400:"#a3b18a",
  200:"#dad7cd"
    },
      },
    },
  },
  plugins: [],
}