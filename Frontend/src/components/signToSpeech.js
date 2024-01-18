import React, { useState, useRef, useEffect } from 'react'
import Speech from "react-speech";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { drawRect, getText } from "../utilities";
import Loader from "react-loader-spinner";
import "../styles/SignToSpeech.scss";

const SignToSpeech = () => {

    const [text, setText] = useState(""); // holds text to be played
    const [error, setError] = useState(false); //show failed to fetch error
    const graphModel = process.env.REACT_APP_SIGNIFY_GRAPH_MODEL || "https://tfjsdetectionmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json";
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true); //show loading sign
    const clearText = () => {
        setText([]);
    };

    // Main function
    const runCoco = async () => {
        const net = await tf.loadGraphModel(graphModel);
        setInterval(() => {
            detect(net);
        }, 1000);
    };


    const detect = async (net) => {

        if (loading) setLoading(false);
        // Check data is available
        if (webcamRef?.current?.video?.readyState === 4) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const { videoWidth, videoHeight } = video;

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


            const boxes = await obj[1].array();
            const classes = await obj[2].array();
            const scores = await obj[4].array();
            // Draw mesh
            const ctx = canvasRef?.current?.getContext("2d");

            requestAnimationFrame(() => {
                drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx);
            });

            //setText in dialog box
            setText(getText(boxes[0], classes[0], scores[0], 0.8).toString());

            tf.dispose(img);
            tf.dispose(resized);
            tf.dispose(casted);
            tf.dispose(expanded);
            tf.dispose(obj);
        }
    };

    useEffect(() => {
        runCoco().catch((err) => {
            console.error(err);
            setError(true);
            setLoading(false);
        });
    }, []);

    return (
        <div className='container'>
            {loading ? (<span id='loading'>Loading model... <Loader type="TailSpin" width={100} height={100} color="#0070f3" /></span>) :
                (<><div className="result-container">
                    <span id='translation'>Translation: {text}</span>
                    <div className="controls">
                        <Speech text={text} voice="Google UK English Female" textAsButton={true} displayText={<i className="fas fa-volume-up"></i>} />
                        <button id="clear" onClick={() => clearText()}>
                            Clear
                        </button>
                    </div>
                </div>
                    <div className='video-container'>
                        <Webcam ref={webcamRef} muted={true} className="webcam" />
                        <canvas ref={canvasRef} />
                    </div></>)}
            {error && <span id='error'>Error: Failed to fetch model</span>}
        </div>
    )
}

export default SignToSpeech;