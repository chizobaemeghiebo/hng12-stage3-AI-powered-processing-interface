import { use, useState } from "react";
import submitLogo from "./assets/send.svg";

function App() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [summary, setSummary] = useState("");
  const [humanReadableDetectedLanguage, setHumanReadableDetectedLanguage] =
    useState("");
  const [originalDetectedLanguage, setOriginalDetectedLanguage] = useState("");
  const [translationOption, setTranslationOption] = useState("en");

  // MESSAGES VARIABLE SO THAT I CAN LOOP THROUGH IT AND DISPLAY CONTENT DYNAMICALLY
  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState([
  //   {
  //     content: text,
  //   },
  // ]);

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
        setMessages((prevMessages) =>
          prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, translation: newTranslated }
              : message
          )
        );
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

  // Summarizer
  const handleSummarize = async () => {
    const options = {
      // sharedContext: 'This is a scientific article',
      type: "key-points",
      format: "plain-text",
      length: "short",
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let summarry;
    let summarizer;
    if (available === "no") {
      // The Summarizer API isn't usable.
      return;
    }
    if (available === "readily") {
      // The Summarizer API can be used immediately .
      try {
        summarizer = await self.ai.summarizer.create(options);
        summarry = await summarizer.summarize(text);
        setSummary(await summarizer.summarize(text));

        setMessages((prevMessages) =>
          prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, summary: summarry }
              : message
          )
        );

        console.log(summarry);
        console.log(messages);
      } catch (error) {
        console.log("The error is: ", error);
      }
    } else {
      // The Summarizer API can be used after the model is downloaded.
      summarizer = await self.ai.summarizer.create(options);
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
    }
  };

  // get readable language name from symbol
  const languageTagToHumanReadable = (languageTag, targetLanguage) => {
    const displayNames = new Intl.DisplayNames([targetLanguage], {
      type: "language",
    });
    return displayNames.of(languageTag);
  };

  // Detector
  const detect = async () => {
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.available;
    let detector;
    if (canDetect === "no") {
      // The language detector isn't usable
      alert("This device does not support ai");
      return;
    }

    if (canDetect === "readily") {
      // The language detector can immediately be used.
      detector = await self.ai.languageDetector.create();
      const someUserText = text;
      const results = await detector.detect(someUserText);
      for (const result of results) {
        // Show the full list of potential languages with their likelihood, ranked
        // from most likely to least likely. In practice, one would pick the top
        // language(s) that cross a high enough threshold.

        try {
          if (result.confidence >= 0.5) {
            setHumanReadableDetectedLanguage(
              languageTagToHumanReadable(result.detectedLanguage, "en")
            );
            setOriginalDetectedLanguage(result.detectedLanguage);
          }
        } catch (error) {
          console.log("Error: ", error);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the user input message to the messages array
    const newMessage = {
      content: text,
      type: "input",
      translation: "",
      summary: "",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    detect(text);

    console.log(messages);
  };

  // for translation
  const handleTranslate = (e) => {
    translate();
    // console.log(translationOption);
  };

  // console.log(messages);

  return (
    <>
      <nav className="p-4 bg-amber-300 flex flex-col justify-center">
        <div className="font-logo text-xl">ZeddGPT</div>
      </nav>

      {/* container */}
      <div className="my-8 container w-[90%] mx-auto max-w-[700px] flex flex-col justify-center items-center min-h-[90vh]  p-4">
        {/* chat feature */}
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-4 p-4 w-full mb-4">
            <div className="p-4 bg-blue-100 text-bold rounded-md text-right self-end">
              <p className="text-base">{message.content}</p>
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
                <p className="text-bold rounded-sm">{message.summary}</p>
              </div>
            )}
            {translated && (
              <div className="p-4 bg-pink-200 text-bold rounded-md text-left self-start">
                <p className="text-bold rounded-sm">{message.translation}</p>
              </div>
            )}
          </div>
        ))}

        {/* initial form */}
        <div className="w-full rounded-4xl relative flex flex-col justify-center">
          <form onSubmit={handleSubmit}>
            <label htmlFor="input"></label>
            <textarea
              name="input"
              id="input"
              placeholder="How may I help you?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="pl-6 py-2  w-full rounded-4xl outline-0 ring-amber-500 ring-2 focus:ring-amber-600"
            ></textarea>
            <button type="submit" className="absolute right-6 top-5">
              <img src={submitLogo} alt="send message" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
