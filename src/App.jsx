import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import translatelogo from "./assets/googletranslate.svg";
import UserInput from "./components/UserInput";
import SelectLanguage from "./components/SelectLanguage";

function App() {
  const [outputText, setOutputText] = useState("");
  const [translated, setTranslated] = useState("");
  const [summary, setSummary] = useState("");
  const [humanReadableDetectedLanguage, setHumanReadableDetectedLanguage] =
    useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");

  // MESSAGES VARIABLE SO THAT I CAN LOOP THROUGH IT AND DISPLAY CONTENT DYNAMICALLY
  const [messages, setMessages] = useState([]);

  // TOASTIFY
  const alertNone = () =>
    toast.warn("Enable Chrome AI flags to continue", {
      theme: "dark",
    });
  const alertNoAi = () =>
    toast.warn("Your browser does not support Chrome AIs", {
      theme: "dark",
    });
  const download = () =>
    toast.warn("dowloading AI feature. Check the console for progress", {
      theme: "dark",
    });
  const translateError = () =>
    toast.warn(
      "Cannot translate to the same language - choose another language",
      { theme: "dark" }
    );
  const summarize = () =>
    toast("Summarize in progress, please wait...", { theme: "dark" });
  // Detector
  const detectLanguage = async (text) => {
    if ("ai" in self && "languageDetector" in self.ai) {
      // The Language Detector API is available.
      // The Language Detector API is available.
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.available;
      let detector;
      if (canDetect === "no") {
        // The language detector isn't usable
        alertNone();
        return;
      }

      if (canDetect === "readily") {
        // The language detector can immediately be used.
        detector = await self.ai.languageDetector.create();
        // const someUserText = text;
        const results = await detector.detect(text);
        for (const result of results) {
          // Show the full list of potential languages with their likelihood, ranked
          // from most likely to least likely. In practice, one would pick the top
          // language(s) that cross a high enough threshold.
          try {
            if (result.confidence >= 0.5) {
              setDetectedLanguage(result.detectedLanguage);
              setHumanReadableDetectedLanguage(
                languageTagToHumanReadable(result.detectedLanguage, "en")
              );
            }
          } catch (error) {
            console.log("Error: ", error);
          }
        }
      } else {
        // The language detector can be used after model download.
        download();
        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
    } else {
      alertNoAi();
    }
  };

  // Translator
  const translate = async (text, translationOption) => {
    if (!("ai" in self) && !("translator" in self.ai)) {
      // The Translator API is supported.
      alertNoAi();
      return;
    }

    const languageTranslatorCapabilities =
      await self.ai.translator.capabilities();
    const canTranslate = languageTranslatorCapabilities.available;
    // change naimg convention
    let translator;
    if (canTranslate === "no") {
      // The language detector isn't usable
      alertNone();
      return;
    }
    if (canTranslate === "readily") {
      // The language detector is usable
      if (detectedLanguage == translationOption) {
        translateError();
      }

      if (detectedLanguage !== translationOption) {
        translator = await window.ai.translator.create({
          sourceLanguage: detectedLanguage,
          targetLanguage: translationOption,
        });
        const newTranslated = await translator.translate(text);

        setTranslated(newTranslated);
        setMessages((prevMessage) => {
          const lastMessage = prevMessage[prevMessage.length - 1];
          if (lastMessage && lastMessage.sender === "system") {
            return prevMessage.map((msg, index) =>
              index === prevMessage.length - 1
                ? { ...msg, text: newTranslated }
                : msg
            );
          } else {
            return [...prevMessage, { sender: "system", text: newTranslated }];
          }
        });
      }
    } else {
      download();
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
    if (!("ai" in self) && !("summarizer" in self.ai)) {
      // The Summarizer API is supported.
      alertNoAi();
      return;
    }

    const options = {
      type: "key-points",
      format: "plain-text",
      length: "short",
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let mainSummary;
    let summarizer;
    if (available === "no") {
      // The Summarizer API isn't usable.
      alertNone();
      return;
    }
    if (available === "readily") {
      summarize();

      // The Summarizer API can be used immediately .
      try {
        summarizer = await self.ai.summarizer.create(options);
        mainSummary = await summarizer.summarize(outputText);
        setSummary(mainSummary);

        setMessages((prevMessage) => {
          const lastMessage = prevMessage[prevMessage.length - 1];
          if (lastMessage && lastMessage.sender === "system") {
            return prevMessage.map((msg, index) =>
              index === prevMessage.length - 1
                ? { ...msg, text: mainSummary }
                : msg
            );
          } else {
            return [...prevMessage, { sender: "system", text: mainSummary }];
          }
        });
      } catch (error) {
        console.log("The error is: ", error);
      }
    } else {
      // The Summarizer API can be used after the model is downloaded.
      summarizer = await self.ai.summarizer.create(options);
      summarizer.addEventListener("downloadprogress", (e) => {
        download();
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

  // for translation
  const handleTranslate = (translationOption) => {
    translate(outputText, translationOption);
  };

  const handleSubmit = (text) => {
    setOutputText(text);

    // add messages in an array so that it will render different divs
    setMessages((prevMessage) => [
      ...prevMessage,
      { sender: "user", text: text },
    ]);

    detectLanguage(text);
  };

  return (
    <>
      <nav className="p-4  flex flex-col justify-center">
        <div className="flex justify-between items-center w-[90%] max-w-[1100px] mx-auto p-4">
          <div className="font-logo text-xl">ZeddGPT</div>
          <div className="w-8">
            <img src={translatelogo} alt="translate logo" />
          </div>
        </div>
      </nav>

      {/* container */}
      <div className="my-8 container w-[90%] mx-auto max-w-[700px] flex flex-col justify-center items-center min-h-[90vh]  p-4">
        {messages.map((message, index) => (
          <div key={index} className="my-8 w-full flex flex-col gap-4">
            {message.text != "" && message.sender == "user" ? (
              <div className="self-end bg-purple-100 p-4 rounded shadow text-right">
                <div>{message.text}</div>
                <span className="inline text-[10px] font-bold text-gray-800">
                  {humanReadableDetectedLanguage}
                </span>
                <div className="flex items-center gap-3">
                  <SelectLanguage onSelectLanguage={handleTranslate} />
                  {message.text.length > 150 && (
                    <button
                      className="text-xs border-2 border-gray-800 rounded-full px-2"
                      onClick={handleSummarize}
                    >
                      Summarize
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="self-start bg-blue-100 p-4 rounded shadow">
                <div>{message.text}</div>
              </div>
            )}
          </div>
        ))}

        <UserInput onUserSubmit={handleSubmit} />

        <ToastContainer position="top-center" />
      </div>
    </>
  );
}

export default App;
