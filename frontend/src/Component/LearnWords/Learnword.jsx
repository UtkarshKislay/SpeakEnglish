import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './Learnword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BallTriangle, MagnifyingGlass, Oval } from 'react-loader-spinner';
import { ClipLoader } from 'react-spinners';


const BASE_URL = 'http://localhost:5000'
const Learnword = () => {
  const data = useSelector((state) => state.userInfo.data);
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [story, setStory] = useState();
  const [wordsResponse, setWordResponse] = useState([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingExcercise, setLoadingExcercise] = useState(false);

  useEffect(() => {
    if (data.userEmail === undefined) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    handleGetWords();
  }, []);

  const handleGetWords = async () => {
    try {
      setLoadingWords(true)
      const res = await axios(`${BASE_URL}/openai/learnWords`, {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: data.userEmail,
        }
      });
      const responseRe = res.data.data;
      const wordPairs = responseRe.split(/\d+\.\s+/).filter(Boolean);

      const wordsArray = wordPairs.map(pair => {
        const [word, definition] = pair.split(' - ');
        const trimmedWord = typeof word === 'string' ? word.trim() : '';
        const trimmedDefinition = typeof definition === 'string' ? definition.trim() : '';

        return { word: trimmedWord, definition: trimmedDefinition };
      });

      setWords(wordsArray);
      setLoadingWords(false)


    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    setWordResponse(prevWords => {
      const newWordsArray = words.map(wordObject => {
        const word = wordObject.word.toLowerCase().replace(/\s*\(.*?\)\s*/g, '');
        return word;
      });
      return [...prevWords, ...newWordsArray];
    });
  }, [words]);

  const handleGetStory = async () => {
    setLoadingStory(true)
    try {
      const wordsArray2 = words.map(word => word.word);
      console.log("words array 2", wordsArray2);


      const res = await axios(`${BASE_URL}/openai/getStory`, {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: data.userEmail,
          words: wordsArray2
        }
      });
      const responseRe = res.data.data;
      setStory(responseRe);
      setLoadingStory(false);
    } catch (err) {
      console.log(err);
    }
  }
  const handleExcercise = async () => {
    setLoadingExcercise(true);
    try {
      const wordsArray2 = words.map(word => word.word);
      console.log("words array 2", wordsArray2);
      const res = await axios(`${BASE_URL}/openai/getExcercise`, {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: data.userEmail,
          words: wordsArray2
        }
      });
      const responseRe = res.data.data;
      console.log(responseRe);
      setLoadingExcercise(false);

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='basecontainer'>
      <div className="LearnWordContainer">
        <p className='LearnWordTopic pageTitle'>Enhance your vocabulary with Ai !!</p>
        {/* <button className='storyBtn' onClick={handleGetWords}>Get Words</button> */}

        {loadingWords ?
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#60fcf2c4"
            ariaLabel="oval-loading"
            secondaryColor=""
            wrapperStyle={{}}
            wrapperClass=""
          />

          : <div className="wordContainer">
            {words.length > 0 && (
              <div className='wordInternalContainer'>
                {words.map((word, index) => (
                  <div key={index} className='wordInternalContainer'>
                    <p className='wordMeaningContainer'>{index + 1}. {word.word} - {word.definition}</p>
                  </div>
                ))}
              </div>
            )}
          </div>}


        {words.length > 0 ?
          <div className="generateStory">
            <div className='LearnWordTopic' style={{ fontSize: "1.7rem" }}>
              Do you want to generate a story using above words !!
            </div>
            <div className="options">
              <button onClick={handleGetStory} className='storyBtn'>Yes</button>
              <button className='storyBtn'>No</button>
            </div>
          </div> : null}

        {loadingStory ?
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#60fcf2c4"
            ariaLabel="oval-loading"
            secondaryColor=""
            wrapperStyle={{}}
            wrapperClass=""
          />
          :
          story ? (
            <div className="storyContainer">
              <div className='storyContent'>
                {story.split(/\s+/).map((word, index) => {
                  const isHighlighted = wordsResponse.indexOf(String(word).trim().toLowerCase().replace(/[^\w\s]/g, ''));
                  return (
                    <span 
                    // style={{backgroundColor:"#49d7ce20"}}
                      key={index}
                      style={{
                        fontStyle: isHighlighted != -1 ? 'italic' : 'normal',
                        color: isHighlighted != -1 ? '#008AFF' : 'white',
                        backgroundColor:"transparent"
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}

              </div>
            </div>
          )
            : null}
  
        {/* {story? (
        <div className="storyContainer">
            <div className='storyContent'>
              {story.split(/\s+/).map((word, index) => {
                const isHighlighted = wordsResponse.indexOf(String(word).trim().toLowerCase().replace(/[^\w\s]/g, ''));
                return (
                  <span
                    key={index}
                    style={{
                      fontStyle: isHighlighted != -1 ? 'italic' : 'normal',
                      color: isHighlighted != -1 ? 'red' : 'inherit',
                    }}
                  >
                    {word}{' '}
                  </span>
                );
              })}

            </div>
        </div>
          )
          :null} */}
        {/* <div className="getExercise">
          <div className='LearnWordTopic' style={{ fontSize: "1.7rem" }}>
            Do you want to complete excercise now !!
          </div>
          <button onClick={handleExcercise} className='storyBtn'>Start</button>
        </div> */}
        {/* {loadingExcercise ?
          <Oval
            visible={true}
            height="80"
            width="80"
            color="blue"
            ariaLabel="oval-loading"
            secondaryColor=""
            wrapperStyle={{}}
            wrapperClass=""
          /> : null
        } */}
      </div>
    </div>
  )
}

export default Learnword