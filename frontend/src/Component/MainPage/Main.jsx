import React, { useEffect } from 'react'
import './Main.css';
import Card from '../Cards/Card';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Main = () => {
  const userData = useSelector((state) => state.userInfo.data);
  const navigate = useNavigate();
  useEffect(() => {
    if (userData.userEmail === undefined) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <div className='container'>
        <div className="title">
          Content
        </div>
        <div className="contentCards">
          <Card title='Improve Vocabulary' content="In this game, you will learn some new English words in a very exciting manner. So let's start !!" link="learnNewWords" />
          <Card title="Speaking Skill" content="In this game, you will engage in direct conversations, which will enhance your speaking skills.  So let's start !!" link="speakAi" />
        </div>

      </div>
    </div>
  )
}

export default Main