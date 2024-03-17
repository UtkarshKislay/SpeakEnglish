import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Component/Login/Login';
import Home from './Component/Home/Home';
import Main from './Component/MainPage/Main';
import Learnword from './Component/LearnWords/Learnword';
import SpeakAi from './Component/ChatWithAi/SpeakAi';
import Navbar from './Component/Navbar/Navbar';
import HomeN from './Component/HomeN/HomeN';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
           <Route
            path="/"
            element={<HomeN />}
          ></Route>
          <Route
            path="/login"
            element={<Login />}
          ></Route>
          <Route
            path="/Main"
            element={<Main />}
          ></Route>
          <Route
            path="/Main/learnNewWords"
            element={<Learnword />}
          ></Route>
           <Route
            path="/Main/speakAi"
            element={<SpeakAi />}
          ></Route>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
