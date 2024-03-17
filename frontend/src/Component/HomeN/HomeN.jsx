import React from 'react'
import Navbar from '../Navbar/Navbar'
import { ReactTyped } from "react-typed";
import './HomeN.css';
const HomeN = () => {
  return (
    <div>
      <Navbar />
      <div className='homeContainer'>
        <div className="homecontent">
          <div className="reactTypedComp">
            <div className="textLearn">
              LEARN
            </div>
            <ReactTyped
              className='reactTypeContent'
              strings={[
                "Communication",
                "Vocabulary",
                "Listening",
              ]}
              style={{ color: "white" }}

              typeSpeed={200}
              backSpeed={100}
              loop
            >
            </ReactTyped>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeN