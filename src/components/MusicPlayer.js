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

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value", value);
    audioRef.current.volume = value / 100;
  }, [value]);

  useEffect(() => {
    const storedFileList = JSON.parse(localStorage.getItem("fileList")) || [];
    setFileList(storedFileList);
  }, []);

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const audioRef = useRef(null);

  const playAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event) => {
    audioRef.current.currentTime =
      (event.target.value * audioRef.current.duration) / 100;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    audioRef.current.src = url;
    setFileList((prevFileList) => [...prevFileList, url]);
    localStorage.setItem("fileList", JSON.stringify([...fileList, url]));
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  return (
    <div className="player-wrapper">
      <div>
        <input type="file" accept="audio/mp3" onChange={handleFileChange} />
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
            <p className="music-playing-title">Seasons in</p>
            <p className="music-playing-artist">James</p>
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
              max={duration}
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
