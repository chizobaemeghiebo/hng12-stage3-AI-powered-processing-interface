import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [detLanguage, setDetLanguage] = useState("");
  const [translationOption, setTranslationOption] = useState("en");

  // Translator
  const translate = async () => {
    const translator = await window.ai.translator.create({
      sourceLanguage: "en",
      targetLanguage: translationOption,
      // TODO: CHECK WHETHER IT NEEDS TO DOWNLOAD FOR NEW DEVICES
      //   if(targetLanguage ){
      // monitor(m) {
      //     m.addEventListener("downloadprogress", (e) => {
      //       console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
      //     });
      //   },
      //   }
    });
    const newTranslated = await translator.translate(text);
    setTranslated(newTranslated);
    // const translator = await window.ai.translator.create({
    //   // sourceLanguage: "es",
    //   // targetLanguage: "ja",
    //   // sourceLanguage: "en",
    //   // targetLanguage: translationOption,
    //   // monitor(m) {
    //   //   m.addEventListener("downloadprogress", (e) => {
    //   //     console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
    //   //   });
    //   // },
    //   console.log(translator)
    // });
    // const newTranslated = await translator.translate(text);
    // console.log(newTranslated);
    // console.log(translationOption);
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

  //Language Detector
  const detect = async (text) => {
    const detector = await self.ai.languageDetector.create();

    const someUserText = text;
    const results = await detector.detect(someUserText);
    for (const result of results) {
      // Show the full list of potential languages with their likelihood, ranked
      // from most likely to least likely. In practice, one would pick the top
      // language(s) that cross a high enough threshold.
      if (result.confidence >= 0.5) {
        setDetLanguage(
          languageTagToHumanReadable(result.detectedLanguage, "en")
        );
        console.log(result);
      }
    }
  };

  return (
    <>
      <h1 className="bg-amber-500 text-center my-12 text-4xl">My AI App</h1>

      <div className="flex flex-col w-3/4 max-w-[1200px] mx-auto">
        {/* display */}
        {detLanguage && (
          <div className="bg-red-50 text-dark">
            <div className="p-2 bg-blue-100 text-bold rounded-sm text-right">
              <p className="text-base">{text}</p>
              {detLanguage && (
                <span className="bg-gray-300 inline py-1 px-2 rounded-full mt-0 text-[10px]">
                  {detLanguage}
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
        <form onSubmit={handleSubmit}>
          <label htmlFor="input"></label>
          <textarea
            name="input"
            id="input"
            placeholder="How may I help you?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-amber-800 w-full"
          ></textarea>
          <button
            type="submit"
            className="border-2 border-amber-900 px-12 py-4 rounded mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
