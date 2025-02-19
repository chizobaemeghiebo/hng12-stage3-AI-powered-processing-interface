// get a human readable tag
const languageTagToHumanReadable = (languageTag, targetLanguage) => {
  const displayNames = new Intl.DisplayNames([targetLanguage], {
    type: "language",
  });
  // console.log(displayNames);
  return displayNames.of(languageTag);
};

const Detector = async () => {
  const languageDetectorCapabilities =
    await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.available;
  let detector;
  //   console.log(languageDetectorCapabilities.available);
  if (canDetect === "no") {
    // The language detector isn't usable
    console.log("no ai");
    return;
  }
  if (canDetect === "readily") {
    // The language detector can immediately be used.
    console.log("detector ready");
    detector = await self.ai.languageDetector.create();
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

  return detector;
};

export default Detector;
// former code
//Language Detector
// const detect = async (text) => {
//   const detector = await self.ai.languageDetector.create();

//   const someUserText = text;
//   const results = await detector.detect(someUserText);
//   for (const result of results) {
//     // Show the full list of potential languages with their likelihood, ranked
//     // from most likely to least likely. In practice, one would pick the top
//     // language(s) that cross a high enough threshold.
//     if (result.confidence >= 0.5) {
//       setDetLanguage(
//         languageTagToHumanReadable(result.detectedLanguage, "en")
//       );
//       console.log(result);
//     }
//   }
// };
{
  humanReadableDetectedLanguage && (
    <div className="flex flex-col gap-4 p-4 w-full mb-4">
      <div className="p-4 bg-blue-100 text-bold rounded-md text-right self-end">
        <p className="text-base">{text}</p>
        <span className="bg-gray-300 inline py-1 px-2 rounded-full mt-0 text-[10px]">
          {humanReadableDetectedLanguage}
        </span>
        <div></div>
      </div>
      <div className="flex gap-2">
        {/* Translate */}
        <label htmlFor="translationOptions" className="text-sm mr-2">
          Translate to:
        </label>
        <select
          name="translationOptions"
          id="translationOptions"
          value={translationOption}
          onChange={(e) => setTranslationOption(e.target.value)}
          className="border-2 border-amber-900 rounded-full text-xs mr-2"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
          <option value="tr">Turkish</option>
          <option value="ru">Russian</option>
        </select>
        <button
          className="border-2 border-amber-900 px-4 py-1 rounded-full text-xs"
          onClick={handleTranslate}
        >
          Translate
        </button>
        {/* TODO: SUMMARIZE */}
        {text.length > 150 && (
          <div>
            <button
              onClick={handleSummarize}
              className="border-2 border-amber-900 px-4 py-1 rounded-full text-xs"
            >
              Summarize
            </button>
          </div>
        )}
      </div>
      {/* response */}
      {summary && (
        <div className="p-4 bg-pink-200 text-bold rounded-md text-left self-start">
          <p className="text-bold rounded-sm">{summary}</p>
        </div>
      )}
      {translated && (
        <div className="p-4 bg-pink-200 text-bold rounded-md text-left self-start">
          <p className="text-bold rounded-sm">{translated}</p>
        </div>
      )}
    </div>
  );
}
