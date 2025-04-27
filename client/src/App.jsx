import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "pages/home/Home";
import About from "pages/about/About";
import Leaderboard from "pages/leaderboard/Leaderboard";
import Settings from "pages/settings/Settings";
import Landing from "pages/landing/Landing"

function App() {
  return (
      <div>
          <BrowserRouter>
            <Routes>
                <Route path="/landing" element={<Landing/>}/>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
      </div>
  )
}

export default App;
