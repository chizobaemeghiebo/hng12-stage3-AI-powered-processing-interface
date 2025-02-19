import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [humanReadableDetectedLanguage, setHumanReadableDetectedLanguage] =
    useState("");
  const [originalDetectedLanguage, setOriginalDetectedLanguage] = useState("");
  const [translationOption, setTranslationOption] = useState("en");

  // Translator
  const translate = async () => {
    const languageTranslatorCapabilities =
      await self.ai.translator.capabilities();
    const canTranslate = languageTranslatorCapabilities.available;
    // change naimg convention
    let translator;
    if (canTranslate === "no") {
      // The language detector isn't usable
      console.log("no ai");
      return;
    }

    if (canTranslate === "readily") {
      // The language detector is usable
      // console.log(originalDetectedLanguage, translationOption);
      translator = await window.ai.translator.create({
        sourceLanguage: originalDetectedLanguage,
        targetLanguage: translationOption,
      });
      if (originalDetectedLanguage !== translationOption) {
        const newTranslated = await translator.translate(text);
        setTranslated(newTranslated);
      }
      // TODO: FIX THIS SO THE ERROR IS PROPERLY DISPLAYED
      // else if (originalDetectedLanguage == translationOption) {
      //   console.log("cannot translate to the same language");
      // }
    } else {
      translator = await window.ai.translator.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(text);
    detect(text);
  };

  // for translation
  const handleTranslate = (e) => {
    e.preventDefault();
    translate();
    // console.log(translationOption);
  };

  // get readable language name from symbol
  const languageTagToHumanReadable = (languageTag, targetLanguage) => {
    const displayNames = new Intl.DisplayNames([targetLanguage], {
      type: "language",
    });
    // console.log(displayNames);
    return displayNames.of(languageTag);
  };
  // detector
  const detect = async () => {
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.available;
    let detector;
    // console.log(languageDetectorCapabilities.available);
    if (canDetect === "no") {
      // The language detector isn't usable
      console.log("no ai");
      return;
    }
    if (canDetect === "readily") {
      // The language detector can immediately be used.
      // console.log("detector ready");
      detector = await self.ai.languageDetector.create();
      const someUserText = text;
      const results = await detector.detect(someUserText);
      for (const result of results) {
        // Show the full list of potential languages with their likelihood, ranked
        // from most likely to least likely. In practice, one would pick the top
        // language(s) that cross a high enough threshold.
        if (result.confidence >= 0.5) {
          setHumanReadableDetectedLanguage(
            languageTagToHumanReadable(result.detectedLanguage, "en")
          );
          setOriginalDetectedLanguage(result.detectedLanguage);
          console.log(result);
        }
      }
    } else {
      // The language detector can be used after model download.
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
    }
  };

  return (
    <>
      <nav className="p-4 bg-amber-300 flex flex-col justify-center">
        <div className="font-logo text-xl">ZeddGPT</div>
      </nav>

      <div className="my-8 container w-[90%] mx-auto max-w-[1100px] flex flex-col justify-center items-center min-h-[90vh] bg-pink-200">
        {/* initial form */}

        <form onSubmit={handleSubmit}>
          <label htmlFor="input"></label>
          <textarea
            name="input"
            id="input"
            placeholder="How may I help you?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-amber-800 w-full p-4"
          ></textarea>
          <button
            type="submit"
            className="border-2 border-amber-900 px-12 py-4 rounded mt-6"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="flex flex-col w-3/4 max-w-[1200px] mx-auto">
        {/* display chat feature*/}
        {humanReadableDetectedLanguage && (
          <div className="bg-red-50 text-dark">
            <div className="p-2 bg-blue-100 text-bold rounded-sm text-right">
              <p className="text-base">{text}</p>
              {humanReadableDetectedLanguage && (
                <span className="bg-gray-300 inline py-1 px-2 rounded-full mt-0 text-[10px]">
                  {humanReadableDetectedLanguage}
                </span>
              )}
            </div>

            <div>
              {/* Translate */}
              <form onSubmit={handleTranslate}>
                <label htmlFor="translationOptions">Translate to: </label>
                <select
                  name="translationOptions"
                  id="translationOptions"
                  value={translationOption}
                  onChange={(e) => setTranslationOption(e.target.value)}
                  className="border-2 border-amber-400"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                  <option value="tr">Turkish</option>
                  <option value="ru">Russian</option>
                </select>

                <button
                  type="submit"
                  className="border-2 border-amber-900 px-8 py-2 rounded-full mt-6"
                >
                  Translate
                </button>
              </form>
            </div>
            {/* TODO: SUMMARIZE */}
            <div>
              <form action="">
                <button
                  type="submit"
                  className="border-2 border-amber-900 px-8 py-2 rounded-full mt-6"
                >
                  Summarize
                </button>
              </form>
            </div>
            <p className="p-2 bg-red-100 text-bold rounded-sm">{translated}</p>
          </div>
        )}

        {/* form */}
      </div>
    </>
  );
}

export default App;
