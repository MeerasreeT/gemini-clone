import { createContext, useState } from "react";
import { runChat } from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [chatResult, setChatResult] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevprompts, setPrevPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  const delayPara = (index, nextChar) => {
    setTimeout(function () {
      setChatResult((prev) => prev + nextChar);
    }, 50 * index);
  };

  const onSent = async (prompt) => {
    if (!prompt || prompt.trim() === "") return;

    console.log("User asked:", prompt);

    setShowGreeting(false);
    setRecentPrompt(prompt);
    setLoading(true);

    try {
      const result = await runChat(prompt);
      console.log("AI Response:", result);

      let formattedResponse = result
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<b>$1</b>")
        .replace(/^\*\s?(.*)$/gm, "$1")
        .replace(/\*/g, "");

      let newResponseArray = formattedResponse.split("");
      setChatResult("");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextChar = newResponseArray[i];
        delayPara(i, nextChar);
      }

      setPrevPrompts((prev) => [
        ...prev,
        { prompt, result: formattedResponse },
      ]);
    } catch (err) {
      console.error("Error in runChat:", err);
      setChatResult("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setChatResult("");
    setRecentPrompt("");
    setPrevPrompts([]); // clears old prompts
    setShowGreeting(true);
    console.clear();
    console.log("Started a new chat session!");
  };

  const contextValue = {
    chatResult,
    setChatResult,
    onSent,
    recentPrompt,
    setRecentPrompt,
    prevprompts,
    setPrevPrompts,
    loading,
    newChat,
    showGreeting,
    setShowGreeting,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
