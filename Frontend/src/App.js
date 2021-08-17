// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.scss";
import { drawRect, getText } from "./utilities";
import Loader from "react-loader-spinner";
import Speech from "react-speech";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true); //show loading sign
  const [fetcherr, setFetcherr] = useState(false); //show failed to fetch error
  const [text, setText] = useState(""); // holds text to be played
  // Main function
  const runCoco = async () => {
    const net = await tf.loadGraphModel(process.env.model);
    setInterval(() => {
      detect(net);
    }, 42);
  };

  const clearText = () => {
    setText([]);
  };
  const detect = async (net) => {
    // Check data is available
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      if (loading) {
        if (obj.length > 0) {
          setLoading(false);
        }
      }
      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(() => {
        drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx);
      });

      //setText in dialog box
      setText(text.concat(getText(boxes[0], classes[0], scores[0], 0.8).toString()));

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco().catch((err) => {
      console.log(err);
      setFetcherr(true);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Signify - Sign Language to Speech Converter</h2>
        {loading ? (
          <h4>
            Loading <Loader type="TailSpin" width={30} height={30} color="#0070f3" />
          </h4>
        ) : null}
        {fetcherr ? <h4>Error: Failed to fetch model</h4> : null}
      </header>
      <main>
        <div className="text-box">
          <p>Translated text: {text}</p>
          <div className="controls">
            <Speech text={text} voice="Google USA English Male" textAsButton={true} displayText={<i class="fas fa-volume-up"></i>} />
            <button id="clear" onClick={() => clearText()}>
              Clear
            </button>
          </div>
        </div>
        <Webcam ref={webcamRef} muted={true} className="webcam" />
        <canvas ref={canvasRef} />
      </main>
    </div>
  );
}

export default App;
