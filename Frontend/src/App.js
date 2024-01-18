// Import dependencies
import React, { useState } from "react";
import "./styles/App.scss";
import SpeechToSign from "./components/speechToSign";
import SignToSpeech from "./components/signToSpeech";

function App() {

  const [mode, setMode] = useState(false); //change mode of conversion

  return (
    <div className="App">
      <header className="App-header">
        <h1>Signify - {!mode ? "Sign Language ➡️ Speech" : "Speech ➡️ Sign Language"} <button onClick={() => { setMode(!mode) }}>
          <i className="fas fa-sync-alt"></i>
        </button></h1>
      </header>
      <main>
        {mode ? <SpeechToSign /> : <SignToSpeech />}

      </main>
      <footer className="App-footer">
        <span>Created by <a href="https://kevzpeter.com" target="_blank" rel="noreferrer" className="App-link">kevzpeter</a></span>
      </footer>
    </div>
  );
}

export default App;
