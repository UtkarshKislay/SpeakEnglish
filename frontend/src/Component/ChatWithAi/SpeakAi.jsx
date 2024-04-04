import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './SpeakAi.css';
import { MdKeyboardVoice } from "react-icons/md";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Comment } from 'react-loader-spinner';
import { v4 as uuidv4 } from 'uuid';
import Chat from './SingleChatDesign/Chat';

import WaveSurfer from 'wavesurfer.js';
import Wave from 'react-wavify'

const BASE_URL = 'http://localhost:5000';
const socket = io.connect(`${BASE_URL}`);

const SpeakAi = () => {
    const { speak } = useSpeechSynthesis();
    const userData = useSelector((state) => state.userInfo.data);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [resFromAi, setResFromAi] = useState("");
    const scrollDiv = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [silenceTimer, setSilenceTimer] = useState(0);
    const [userMessages, setUserMessages] = useState([]);
    const utterance = new SpeechSynthesisUtterance();
    const [isSpeaking,setIsSpeaking]=useState(false);
    const waveRef = useRef(null);


    const [speechDetail, setSpeechDetail] = useState({
        height: 0,
        amplitude: 0,
        speed: 0,
        points: 3
    });


    const [audioData, setAudioData] = useState(null);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const analyserRef = useRef(null);


    const navigate = useNavigate();
    useEffect(() => {
        if (userData.userEmail === undefined) {
            // navigate("/");
        }
    }, []);


    useEffect(() => {
        scrollDiv.current?.scrollIntoView({
            behaviour: 'smooth',
            block: 'end'
        });
    }, [transcript, resFromAi]);

    // useEffect(() => {
    //     const handleListing = () => {
    //         setIsListening(true);
    //         SpeechRecognition.startListening({
    //             continuous: true,
    //         });
    //     };
    //     handleListing();
    // }, []);

    useEffect(() => {
        try {
            socket.on('aiResponse', (response) => {
                setLoadingResponse(false);
                setResFromAi(response);
                const messageId = uuidv4();
                const newMessage = {
                    role: 'Ai',
                    id: messageId,
                    content: response
                }
                setUserMessages(prevMessages => [...prevMessages, newMessage]);
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(()=>{
       console.log("spekin ",isSpeaking);
    },[isSpeaking])

    useEffect(() => {
        const speakFunction = () => {
            const utterance = new SpeechSynthesisUtterance(resFromAi);
            utterance.onend = handleSpeechEnd;

            speak(utterance);
         
        }

        if (resFromAi !== "") {
            speakFunction();
        }
    }, [resFromAi]);

    const handleSpeechEnd=()=>{
        setIsSpeaking(()=>{return false});
    }



    const stopHandle = () => {
        try {
            const messageId = uuidv4();
            const newMessage = {
                role: 'user',
                id: messageId,
                content: transcript
            }
            setUserMessages(prevMessages => {
                const updatedMsg = [...prevMessages, newMessage];
                socket.emit('userMessage', updatedMsg);
                return updatedMsg;
            });
            setLoadingResponse(true);
            resetTranscript();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        return () => {
            setIsListening(false);
            SpeechRecognition.stopListening();
        };
    }, []);


    useEffect(() => {
        console.log("utternace is :", utterance);
        if (transcript !== '') {
            clearTimeout(silenceTimer);
            const timer = setTimeout(() => {
                if(!isSpeaking){
                    stopHandle();
                }
            }, 2000);
            setSilenceTimer(timer);
        }
    }, [transcript]);

    return (
        <div className='speakAiContainer'>
            <div className="chatBoxContainer">
                <div className='titleContainer'>
                    <div className="titleText">
                        Speak With Ai
                    </div>
                    <div className="info">
                        <p className='infoPara'>
                            You may initiate the conversation by asking,
                            <br />
                            <span style={{ color: "#008AFF" }}>
                                How are you today?
                            </span>
                            <br />
                            Alternatively,
                            <br />
                            feel free to introduce any topic you find
                            <br />relevant or wish to discuss.
                        </p>
                    </div>
                </div>
                <div className='chatBox'>
                    <div >
                        <div className="chatContainer">
                            {userMessages != null ? userMessages.map((msg) => {
                                return (
                                    <Chat key={msg.id} message={msg} />
                                )
                            }) : null}
                            {loadingResponse ?
                                <Comment
                                    visible={true}
                                    height="80"
                                    width="80"
                                    ariaLabel="comment-loading"
                                    wrapperStyle={{ backgroundColor: "transparent" }}
                                    wrapperClass="comment-wrapper"
                                    color="#fff"
                                    backgroundColor="gray"
                                /> : null
                            }
                            <div className="transcript" >
                                {transcript}

                                <div>
                                    {/* <canvas width={800} height={200} style={{backgroundColor:"black",border:"2px solid red"}}>

                                    </canvas> */}
                                    {/* <div style={{ height: `${height}px`, width: '100px', backgroundColor: 'blue' }}>
                                        
                                    </div> */}
                                </div>



                            </div>
                            <div ref={scrollDiv}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpeakAi;









