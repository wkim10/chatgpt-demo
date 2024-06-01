"use client";

import React from "react";

export default function Home() {
  const [inputText, setInputText] = React.useState<string>("");
  const [completionText, setCompletionText] = React.useState<string | null>("");
  const [temperature, setTemperature] = React.useState<number>(1);
  const [maxTokens, setMaxTokens] = React.useState<number>(4096);
  const [error, setError] = React.useState<boolean>(false);

  const setTemperatureWithLimits = React.useCallback(
    (newTemperature: number) => {
      if (newTemperature >= 0 && newTemperature <= 2) {
        setTemperature(newTemperature);
      } else if (newTemperature < 0) {
        setTemperature(0);
      } else {
        setTemperature(2);
      }
    },
    []
  );

  const setMaxTokensWithLimits = React.useCallback((newMaxTokens: number) => {
    if (newMaxTokens >= 1 && newMaxTokens <= 4096) {
      setMaxTokens(newMaxTokens);
    } else if (newMaxTokens < 1) {
      setMaxTokens(1);
    } else {
      setMaxTokens(4096);
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    await fetch(`http://localhost:8000/api/completion`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: inputText,
        temperature: temperature,
        maxTokens: maxTokens,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Received from server:", data);
        setCompletionText(data.completionText);
        setError(data.error);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [inputText, maxTokens, temperature]);

  return (
    <div className="flex flex-col items-center p-14">
      <h1 className="font-bold text-4xl mb-5">Chat-GPT Demo</h1>
      <div className="flex flex-row justify-between gap-10">
        <div>
          <div className="text-2xl text-center mb-2">
            Ask ChatGPT a Question!
          </div>
          <textarea
            id="input"
            name="input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="text-gray-400 rounded p-2 bg-gray-800"
            rows={20}
            cols={50}
          />
        </div>
        <div>
          <div className="text-2xl text-center mb-2">
            ChatGPT&apos;s Response
          </div>
          <textarea
            value={
              error
                ? `There was an error. Please adjust the "Temperature" or "Max Tokens" settings and try again.`
                : completionText !== null
                ? completionText
                : ""
            }
            className={
              (error ? "text-red-600 " : "text-gray-400 ") +
              "rounded p-2 bg-gray-800"
            }
            rows={20}
            cols={50}
          />
        </div>
      </div>
      <div className="flex flex-row gap-10 items-center mt-4">
        <div className="flex flex-row gap-3 items-center">
          <div>Temperature (Min: 0 | Max: 2)</div>
          <input
            type="number"
            className="text-gray-400 rounded p-2 bg-gray-800 w-20"
            value={temperature}
            onChange={(e) => setTemperatureWithLimits(Number(e.target.value))}
            min={0}
            max={2}
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div>Max Tokens (Min: 1 | Max: 4096)</div>
          <input
            type="number"
            className="text-gray-400 rounded p-2 bg-gray-800 w-20"
            value={maxTokens}
            onChange={(e) => setMaxTokensWithLimits(Number(e.target.value))}
            min={1}
            max={4096}
          />
        </div>
      </div>
      <button
        className="bg-blue-500 rounded text-xl p-2 mt-5"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
}
