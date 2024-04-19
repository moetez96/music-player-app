import { useState } from "react";
import placeHolderImage from "../../src/styles/assets/images/placeholder.png";
import "../styles/components/musicPlayer.scss";
import VolUpIcon from "./icons/VolUpIcon";
import { useEffect } from "react";
import SkipFwdIcon from "./icons/SkipFwdIcon";
import SkipBackIcon from "./icons/SkipBackIcon";
import PlayIcon from "./icons/PlayIcon";

function MusicPlayer() {
  const initialValue = 50;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    console.log(value);
    document.documentElement.style.setProperty("--slider-value", value);
  }, [value]);

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="player-wrapper">
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
            <PlayIcon />
            <SkipFwdIcon />
          </div>
          <div className="music-playing-slider">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={handleInputChange}
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
