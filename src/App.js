import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainScreen from "./components/layout/MainScreen";
import Navigation from "./components/layout/Navigation";
import FavoriteScreen from "./components/layout/FavoriteScreen"; 
import EventEmitter from './services/EventEmitter';
import { getAudioCover, loadTracksFromDB } from './services/MusicDBService';

function App() {
  const [musicList, setMusicList] = useState([]);
  const [coverPicture, setCoverPicture] = useState(null);

  useEffect(() => {
    fetchAndSetTracks();  
    
    EventEmitter.on("tracksChanged", fetchAndSetTracks);

    return () => {
      EventEmitter.off("tracksChanged", fetchAndSetTracks);
    };
  }, []);

  useEffect(() => {
    if (musicList.length !== 0) {
      fetchCurrentTrackCoverPicture();  
    }
  }, [musicList]);

  useEffect(() => {
    if (coverPicture) {
      document.body.style.backgroundImage = `
      linear-gradient(to top, rgba(29, 33, 35, 1) 40%,
      rgba(29, 33, 35, 0.8) 70%, 
      rgba(29, 33, 35, 0.7) 100%),
      url(${coverPicture})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [coverPicture]);

  async function fetchAndSetTracks() {
    const tracks = await loadTracksFromDB();
    setMusicList(tracks);
  }

  async function fetchCurrentTrackCoverPicture() {
    const index = musicList.findIndex((item) => item.selected);
    if (index !== -1) {
      const coverPic = await getAudioCover(musicList[index]);
      if (coverPic) {
        setCoverPicture(coverPic.coverPicture);
      } else {
        setCoverPicture(null);
      }
    }
  }

  return (
    <Router>
      <>
        <Header />
        <div className="main-screen-wrapper">
          <Navigation />
          <Routes>
            <Route path="/" element={<MainScreen musicList={musicList} />} />
            <Route path="/favorites" element={<FavoriteScreen />} />
          </Routes>
        </div>
        <Footer />
      </>
    </Router>
  );
}

export default App;
