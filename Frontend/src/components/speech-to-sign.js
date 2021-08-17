import React, { useState } from "react";
import { imgArray } from "../utils/imageimport";
import "../styles/SpeechtoSign.scss";
const SpeechToSign = () => {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div className="container">
      <form className="form">
        <formgroup className="formgroup">
          <label>Translate to Sign Language</label>
          <textarea type="text" name="text" maxLength="100" required="true" placeholder="Enter text" onChange={(e) => setText(e.target.value)}></textarea>
        </formgroup>
        <button
          type="submit"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            setOutput(text);
          }}
        >
          Convert
        </button>
      </form>
      <div className="signContainer">
        {output
          ? [...output.trim().toUpperCase()].map((el, idx) => {
              if (el.match(/[A-Z]/)) return <img key={idx} src={imgArray[el.charCodeAt(0) - 65]} alt={el} />;
              else if (el === " ") return <br />;
              else return null;
            })
          : null}
      </div>
    </div>
  );
};

export default SpeechToSign;
