import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { saveUserTranscript } from '../../Redux/action';


const SpeechRecognization = () => {
    const [speechText,setSpeechText]=useState("");
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const dispatch=useDispatch();
    useState(()=>{
        setSpeechText(speechText+" "+transcript);
        console.log("Speech: ",speechText)
    },[transcript]);
    useEffect(()=>{
       dispatch(saveUserTranscript(speechText));
    },[speechText])
    const handleStart = () => { 
        SpeechRecognition.startListening();
    };
    const handleStop = () => {
        SpeechRecognition.stopListening();
    };
    const handleReset=()=>{
        resetTranscript();
        setSpeechText("");
    }
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    return (
        <div>
              <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleReset}>Reset</button>
            {transcript}
        </div>
    )
}

export default SpeechRecognization