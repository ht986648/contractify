// "use client";
// import { useEffect } from "react";

// export default function GoogleTranslate() {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: "en" },
//         "google_translate_element"
//       );
//     };
//   }, []);

//   return <div id="google_translate_element"></div>;
// }

// "use client";
// import { useEffect, useState } from "react";

// export default function GoogleTranslate() {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Load Google Translate script dynamically
//     const script = document.createElement("script");
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//         },
//         "google_translate_element"
//       );
//       setIsLoaded(true); // Mark as loaded once initialized
//     };
//   }, []);

//   return (
//     <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start space-y-2">
//       {/* Translate Button */}
//       <button
//         onClick={() => setIsVisible(!isVisible)}
//         className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 transition"
//       >
//         🌍 Translate
//       </button>

//       {/* Google Translate Widget (Initially hidden) */}
//       <div
//         id="google_translate_element"
//         className={`${
//           isVisible ? "block" : "hidden"
//         } bg-white p-2 shadow-lg rounded-lg border`}
//       ></div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,hi,zh,ar,ru,ja,ko,pt", // Add more as needed
          layout: google.translate.TranslateElement.InlineLayout.VERTICAL,
        },
        "google_translate_element"
      );

      // Force dropdown to be scrollable
      setTimeout(() => {
        const translateContainer = document.querySelector(
          ".goog-te-menu-frame.skiptranslate"
        );
        if (translateContainer) {
          translateContainer.style.height = "200px";
          translateContainer.style.overflowY = "auto";
        }
      }, 1000); // Delay to ensure it loads
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start space-y-2">
      {/* 🌍 Translate Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 transition flex items-center"
      >
        🌍 Translate
      </button>

      {/* 🌎 Google Translate Widget (Scrollable Dropdown) */}
      <div
        className={`absolute bottom-14 left-0 bg-white p-3 shadow-lg rounded-lg border w-[250px] ${
          isVisible ? "block" : "hidden"
        }`}
      >
        <div
          id="google_translate_element"
          className="max-h-[200px] overflow-y-auto"
        ></div>
      </div>
    </div>
  );
}
