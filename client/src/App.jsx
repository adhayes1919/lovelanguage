import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import Navbar from "components/Navbar";
import Home from "pages/home/Home";
import About from "pages/about/About";
import Leaderboard from "pages/leaderboard/Leaderboard";
import Create from "pages/create/Create";
import Settings from "pages/settings/Settings";

function App() {
  return (
      <div>
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/create" element={<Create />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
      </div>
  )
}

export default App;
