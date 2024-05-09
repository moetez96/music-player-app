import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainScreen from "./components/layout/MainScreen";
import Navigation from "./components/layout/Navigation";
import FavoriteScreen from "./components/layout/FavoriteScreen"; 

function App() {
  return (
    <Router>
      <>
        <Header/>
        <div className="main-screen-wrapper">
          <Navigation />
          <Routes>
            <Route path="/" element={<MainScreen />} />
            <Route path="/favorites" element={<FavoriteScreen />} />
          </Routes>
        </div>
        <Footer/>
      </>
    </Router>
  );
}

export default App;