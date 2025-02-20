{
  text &&
    messages.map((message, index) => (
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
    ));
}
