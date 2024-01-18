import React, { useState } from "react";
import { imgArray } from "../utils/imageimport";
import "../styles/SpeechtoSign.scss";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const SpeechToSign = () => {

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const clearText = (e) => {
    e.preventDefault();
    setText("");
    setOutput("");
    resetTranscript();
  };
  return (
    <div className="speech-to-sign">
      <div>
        {listening ? <button onClick={() => {
          SpeechRecognition.stopListening();
          setText(transcript);
        }} className="microphone" id="enable"><i className="fa-solid fa-microphone"></i></button> :
          <button onClick={(e) => {
            clearText(e);
            SpeechRecognition.startListening({ continuous: true });
          }} className="microphone" id="disable"><i className="fa-solid fa-microphone-slash"></i></button>}
      </div>
      <div className="input-container">
        <label id="text">
          <input type="text" name="text" maxLength="100" required={true} placeholder="Enter text" value={listening ? transcript : text} disabled={listening} onChange={(e) => setText(e.target.value)}></input>
        </label>
        <div className="controls">
          <button type="submit" className="btn" onClick={(e) => {
            e.preventDefault();
            setOutput(text);
          }}
          >
            Convert
          </button>
          <button id="clear" type="button" onClick={(e) => clearText(e)}>
            Clear
          </button>
        </div>
      </div>
      <div className="signContainer">
        {output && [...output.trim().toUpperCase()].map((el, idx) => {
          if (el.match(/[A-Z]/)) return <img key={idx} src={imgArray[el.charCodeAt(0) - 65]} alt={el} />;
          else if (el === " ") return <br />;
          else return null;
        })}
      </div>
    </div>

  );
};

export default SpeechToSign;
