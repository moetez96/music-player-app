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
  const [overView, setOverView] = useState(false);
  const [searchText, setSearchText] = useState("");

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
      linear-gradient(to top, rgba(29, 33, 35, 1) 30%,
      rgba(29, 33, 35, 0.9) 50%,
      rgba(29, 33, 35, 0.85) 60%,
      rgba(29, 33, 35, 0.79) 80%,
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

  const updateOverView = (newState) => {
      setOverView(newState);
  };

  async function searchSetTracks(text) {
    setSearchText(text)
    const tracks = await loadTracksFromDB();
    const filteredTracks = tracks?.filter((elem) => elem.title.toLowerCase().includes(text.toLowerCase()));
    setMusicList(filteredTracks);
  }

  const handleNavigationChange = async () => {
    await searchSetTracks("");
  }

  return (
    <Router>
      <>
        <Header searchSetTracks={searchSetTracks} searchText={searchText}/>
        <div className="main-screen-wrapper">
          <Navigation handleNavigationChange={handleNavigationChange}/>
          <Routes>
            <Route path="/" element={<MainScreen musicList={musicList} coverPicture={coverPicture} overView={overView} updateOverView={updateOverView}/>}/>
            <Route path="/favorites" element={<FavoriteScreen searchText={searchText} musicList={musicList} coverPicture={coverPicture} overView={overView} updateOverView={updateOverView}/>} />
          </Routes>
        </div>
        <Footer overView={overView} updateOverView={updateOverView}/>
      </>
    </Router>
  );
}

export default App;
