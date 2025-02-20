import { useState } from "react";
import submitLogo from "../assets/send.svg";

const UserInput = ({ onUserSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) {
      alert("Please put in a text");
    }
    onUserSubmit(text);
    setText("");

    // Add the user input message to the messages array
    // const newMessage = {
    //   content: text,
    //   type: "input",
    //   translation: "",
    //   summary: "",
    // };

    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    // detect(text);
  };

  return (
    <div className="w-full rounded-4xl relative flex flex-col justify-center">
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            name="input"
            id="input"
            placeholder="How may I help you?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-6 py-2 shadow-md w-full rounded-4xl outline-0 ring-red-500 ring-2 focus:ring-red-600"
          ></textarea>
        </div>
        <button type="submit" className="absolute right-6 top-5">
          <img src={submitLogo} alt="send message" />
        </button>
      </form>
    </div>
  );
};

export default UserInput;
