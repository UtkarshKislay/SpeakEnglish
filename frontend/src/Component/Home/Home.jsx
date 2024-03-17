import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import ChatBox from '../ChatBoxComponent/ChatBox';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import SpeechRecognization from '../SpeechRecog/SpeechRecognization';
const BASE_URL = 'http://localhost:5000'

const Home = () => {

  const navigate = useNavigate();
  const data = useSelector((state) => state.userInfo.data);
  const transcript = useSelector((state) => state.userTranscript.data);
  const [query, setQuery] = useState("");
  const [queryResponse, setQueryResponse] = useState();
  const [prevChat, setPrevChat] = useState([]);
  const [laoding, setLoading] = useState(0);

  console.log("TRAnspci: ", transcript);



  useEffect(() => {
    if (data.userName === undefined) {
      navigate("/");
    } else {
      const initializeMessageBox = async () => {
        try {
          const res = await axios(`${BASE_URL}/openai/initializeChatResponse`, {
            method: 'post',
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              email: data.userEmail
            }
          });
          console.log(res.data);
          setPrevChat(res.data.data);
        } catch (err) {
          console.log(err);
        }
      }
      initializeMessageBox();
    }
  }, []);



  const handleQuery = async () => {
    try {
      const uniqueId = uuidv4();
      const dateCreated = new Date().toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' });
      const newChat = {
        uniqueId: uniqueId,
        message: query,
        senderAdd: 'User',
        createdAt: dateCreated
      }

      setPrevChat(prevPrevChat => [...prevPrevChat, newChat]);

      setLoading(1);
      const res = await axios(`${BASE_URL}/openai/chat`, {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: data.userEmail,
          message: query,
          uniqueId: uniqueId,
          createdAt: dateCreated
        }
      });
      const responseRe = await res.data;
      if (responseRe.message === "Query execute Successfully") {
        const newData = await responseRe.data;
        setPrevChat(prevPrevChat => [...prevPrevChat, newData]);
        setQueryResponse(1);
        setQuery("");
        setLoading(0);
      } else {
        console.log(responseRe);
      }
    } catch (err) {
      console.log(err);
    }
  }



  return (
    <div>
      {data.userName}
      {data.userEmail}

      <div className='ChatBox'>

        <div className='prevChat'>
          ChatBox
          <ChatBox data={prevChat} load={laoding} />
        </div>

        <div className='Enter Query'>
          {transcript}
          <input type="text" placeholder='Enter ' name='query' value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button disabled={!query} onClick={handleQuery}>Send</button>
          <SpeechRecognization />
        </div>
      </div>




    </div>
  )
}

export default Home