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

  return <div></div>;
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
