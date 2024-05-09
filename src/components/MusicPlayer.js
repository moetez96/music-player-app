import React, { useState, useRef, useEffect } from "react";
import LocalBase from "localbase";
import placeHolderImage from "../../src/styles/assets/images/placeholder.png";
import "../styles/components/musicPlayer.scss";
import VolUpIcon from "./icons/VolUpIcon";
import SkipFwdIcon from "./icons/SkipFwdIcon";
import SkipBackIcon from "./icons/SkipBackIcon";
import PlayIcon from "./icons/PlayIcon";
import EventEmitter from "../services/EventEmitter";

const db = new LocalBase("musicDB");

function MusicPlayer() {
  const initialValue = 50;
  const [value, setValue] = useState(initialValue);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [track, setTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value-volume", value);
    audioRef.current.volume = value / 100;
  }, [value]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--slider-value-duration",
      currentTime
    );
  }, [currentTime]);

  useEffect(() => {
    const updateMusicList = async () => {
      try {
        const listM = await db.collection("tracks").get();
        const index = listM.findIndex((item) => item.selected);
        if (index !== -1) {
          const existingTrack = await db
            .collection("audioUrls")
            .doc({ id: listM[index].urlId })
            .get();

          setTrack(listM[index]);
          const audioUrl = URL.createObjectURL(
            new Blob([existingTrack.arrayBuffer])
          );
          setCurrentSong(audioUrl);
          if (audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.addEventListener("loadedmetadata", () => {
              setDuration(audioRef.current.duration);
            });
          } else {
            console.error("Audio URL not found in LocalBase.");
          }
        } else {
          setTrack(null);
          setCurrentSong(null);
        }
      } catch (error) {
        console.error("Error fetching music list from LocalBase:", error);
      }
    };

    updateMusicList();

    EventEmitter.on("tracksChanged", updateMusicList);

    return () => {
      EventEmitter.off("tracksChanged", updateMusicList);
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
    document.documentElement.style.setProperty(
      "--slider-value-duration",
      currentTime
    );
  };

  const updateTime = () => {
    setCurrentTime((audioRef.current.currentTime / duration) * 100);
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
            <p className="music-playing-title">
              {track ? track.title : ""}
            </p>
            <p className="music-playing-artist">
              {track ? track.artist : ""}
            </p>
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
