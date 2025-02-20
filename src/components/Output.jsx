import SelectLanguage from "./SelectLanguage";

const Output = ({
  outputText,
  detectedLanguage,
  summary,
  translatedText,
  handleTranslate,
  handleSummarize,
}) => {
  return (
    <>
      <div className="w-full my-4 p-4 rounded-md flex flex-col gap-4">
        <div className="self-end bg-red-100 p-4 rounded shadow text-right">
          <div className="m-0">{outputText}</div>
          <span className="inline text-[10px] font-bold text-gray-800">
            {detectedLanguage}
          </span>

          <div>
            {outputText && (
              <SelectLanguage onSelectLanguage={handleTranslate} />
            )}
            {outputText.length > 150 && (
              <button
                className="text-xs border-2 border-red-900 rounded-full px-2"
                onClick={handleSummarize}
              >
                Summarize
              </button>
            )}
          </div>
        </div>
        <div className="self-start bg-green-100 p-4 rounded shadow">
          {translatedText && (
            <div>
              <p>{translatedText}</p>
            </div>
          )}
          {summary && (
            <div>
              <strong>Summary:</strong>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Output;
