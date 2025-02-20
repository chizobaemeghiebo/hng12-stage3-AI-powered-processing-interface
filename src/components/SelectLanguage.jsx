import { useState } from "react";
const SelectLanguage = ({ languages, onSelectLanguage }) => {
  const [translationOption, setTranslationOption] = useState("en");

  const handleSelect = () => {
    onSelectLanguage(translationOption);
  };

  return (
    <div className="flex gap-3 text-xs items-center">
      <label htmlFor="translationOption">Translate to: </label>
      <select
        name="translationOptions"
        id="translationOptions"
        value={translationOption}
        onChange={(e) => setTranslationOption(e.target.value)}
        className="border-2 border-red-900 rounded-full text-xs mr-2 px-2"
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="pt">Portuguese</option>
        <option value="es">Spanish</option>
        <option value="tr">Turkish</option>
        <option value="ru">Russian</option>
      </select>
      <button
        className="text-xs border-2 border-red-900 rounded-full px-2"
        onClick={handleSelect}
      >
        Translate
      </button>
    </div>
  );
};

export default SelectLanguage;
