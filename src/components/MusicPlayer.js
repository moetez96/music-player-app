import { useState, useRef, useEffect } from "react";
import placeHolderImage from "../../src/styles/assets/images/placeholder.png";
import "../styles/components/musicPlayer.scss";
import VolUpIcon from "./icons/VolUpIcon";
import SkipFwdIcon from "./icons/SkipFwdIcon";
import SkipBackIcon from "./icons/SkipBackIcon";
import PlayIcon from "./icons/PlayIcon";

function MusicPlayer() {
  const initialValue = 50;
  const [value, setValue] = useState(initialValue);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value-volume", value);
    audioRef.current.volume = value / 100;
  }, [value]);

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value-duration", currentTime);
    const storedFileList = JSON.parse(localStorage.getItem("fileList")) || [];
    setFileList(storedFileList);
  }, []);

  useEffect(() => {
    const updateMusicList = () => {
      const listM = JSON.parse(localStorage.getItem("musicList")) || [];
      const index = listM.findIndex((item) => item.selected);
      if (index !== -1) {
        setCurrentSong(listM[index]);
        const audioUrl = listM[index].url;
        if (audioUrl) {
          audioRef.current.src = audioUrl;
          audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(listM[index].duration);
          });
        } else {
          console.error("Audio URL not found in local storage.");
        }
      }
    };
  
    updateMusicList();
    window.addEventListener("storage", updateMusicList);
    return () => {
      window.removeEventListener("storage", updateMusicList);
    };
  }, []);
  

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const playAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event) => {
    audioRef.current.currentTime = (event.target.value / 100) * duration;
    setCurrentTime(event.target.value);
    document.documentElement.style.setProperty("--slider-value-duration", currentTime);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      setFileList((prevFileList) => [...prevFileList, url]);
      localStorage.setItem("fileList", JSON.stringify([...fileList, url]));
      

    } else {

      // Handle error
      console.error("Invalid file type. Please select an audio file.");
    }
  };

  const updateTime = () => {
    setCurrentTime((audioRef.current.currentTime / duration) * 100);
    document.documentElement.style.setProperty("--slider-value-duration", currentTime);
  };

  return (
    <div className="player-wrapper">
      <div>
        <audio
          ref={audioRef}
          controls
          onTimeUpdate={updateTime}
          style={{ display: "none" }}
        />
      </div>
      <div className="music-playing-container">
        <div className="music-playing-image-container">
          <div className="music-playing-image">
            <img src={placeHolderImage} alt="cover" />
          </div>
          <div className="music-playing-shdes">
            <p className="music-playing-title">{currentSong ? currentSong.title : ""}</p>
            <p className="music-playing-artist">{currentSong ? currentSong.artist : ""}</p>
          </div>
        </div>
        <div className="music-playing-options">
          <div className="music-playing-buttons">
            <SkipBackIcon />
            <div onClick={playAudio}>
              <PlayIcon />
            </div>
            <SkipFwdIcon />
          </div>
          <div className="music-playing-slider">
          <input
              type="range"
              min={0}
              max={100}
              value={currentTime}
              onChange={handleSliderChange}
              className="music-playing-sliders"
            />
          </div>
        </div>
        <div className="music-playing-volume">
          <VolUpIcon />
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={handleInputChange}
            className="music-volume-sliders"
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
