import React, { useState, useRef, useEffect } from "react";
import placeHolderImage from "../styles/assets/images/music_placeholder.jpg";
import "../styles/components/musicPlayer.scss";
import VolUpIcon from "./icons/VolUpIcon";
import SkipFwdIcon from "./icons/SkipFwdIcon";
import SkipBackIcon from "./icons/SkipBackIcon";
import PlayIcon from "./icons/PlayIcon";
import EventEmitter from "../services/EventEmitter";
import { formatDuration } from "../utils/Shared";
import RepeatIcon from "./icons/RepeatIcon";
import PlayRandomIcon from "./icons/PlayRandomIcon";
import PauseIcon from "./icons/PauseIcon";
import {
  getAudioCover,
  refreshMusicList,
  selectTrack,
} from "../services/MusicDBService";

function MusicPlayer({favoriteMusicList, musicList, coverPicture, isFavoritesRoute, overView, updateOverView}) {
  const initialValue = 50;
  const [value, setValue] = useState(initialValue);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);
  const audioRef = useRef(null);
  const [repeat, setRepeat] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [firstMount, setFirstMount] = useState(true);
  const [allTracks, setAllTracks] = useState([]);
  const [image, setImage] = useState(placeHolderImage);

  useEffect(() => {
    setImage(coverPicture ? coverPicture : placeHolderImage);

    if (isFavoritesRoute) {
      setAllTracks(favoriteMusicList);
    } else {
      setAllTracks(musicList);
    }
  }, [coverPicture, favoriteMusicList, musicList]);

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
    if (!repeat) {
      setIsPlaying(false);
    }

    if (track && repeat != null && !firstMount && isPlaying) {
      setTimeout(() => {
        audioRef.current.play();
      }, 100);
    }
  }, [track, firstMount]);

  useEffect(() => {
    const updateMusicList = () => {
      refreshMusicList(isFavoritesRoute)
        .then((result) => {
          setAllTracks(result.tracks);
          if (result.track) {
            setTrack(result.track);

          }
          if (result.audioUrl) {
            audioRef.current.src = result.audioUrl;
            audioRef.current.addEventListener("loadedmetadata", () => {
              setDuration(audioRef.current.duration);
              if (firstMount) {
                setFirstMount(false);
              }
            });
          } else {
            console.error("Audio URL not found in LocalBase.");
          }
        })
        .catch((error) => {
          console.error("Error updating music list:", error);
        });
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

  const changeVolume = () => {
    if (value < 20 && value !== 0) {
      setValue(0);
    } else if (value === 0) {
      setValue(100);
    } else {
      setValue(value / 2);
    }
  };

  const playAudio = async () => {
    if (isPlaying) {
      await audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRepeat = () => {
    setRepeat((prevState) => {
      switch (prevState) {
        case null:
          return "One";
        case "One":
          return "All";
        case "All":
          return null;
        default:
          return null;
      }
    });
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
  };

  const nextTrack = async () => {
    if (allTracks?.empty) {
      console.log("No tracks found");
    } else {
      const trackIndex = allTracks?.findIndex((doc) => doc.id === track.id);
      if (shuffle) {
        var randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allTracks?.length);
        } while (randomIndex === trackIndex);

        await selectTrack(allTracks[randomIndex]);
      } else if (trackIndex !== -1 && trackIndex < allTracks?.length) {
        await selectTrack(allTracks[trackIndex + 1]);
      } else {
        setIsPlaying(false);
        console.log("No tracks found");
      }
      EventEmitter.emit("tracksChanged");
    }
  };

  const previousTrack = async () => {
    if (allTracks?.empty) {
      console.log("No tracks found");
    } else {
      const trackIndex = allTracks?.findIndex((doc) => doc.id === track.id);
      if (trackIndex !== -1 && trackIndex > 0) {
        await selectTrack(allTracks[trackIndex - 1]);
        EventEmitter.emit("tracksChanged");
      } else {
        setIsPlaying(false);
        console.log("No tracks found");
      }
    }
  };

  const handleSliderChange = (event) => {
    audioRef.current.currentTime = (event.target.value / 100) * duration;
    setCurrentTime(event.target.value);
    document.documentElement.style.setProperty(
      "--slider-value-duration",
      currentTime
    );
  };

  const updateTime = async () => {
    setCurrentTime((audioRef.current.currentTime / duration) * 100);

    if (audioRef.current.currentTime === duration) {
      if (repeat === "One") {
        setTrack(track);
        EventEmitter.emit("tracksChanged");
      } else if (repeat === "All") {
        nextTrack();
      } else if (repeat === null) {
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOverViewClick = () => {
    updateOverView(!overView);
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
        <div className="music-playing-image-container" onClick={handleOverViewClick}>
          <div className="music-playing-image">
            <img src={image} alt="cover" />
          </div>
          <div className="music-playing-shdes">
            <p className="music-playing-title">{track ? track.title : ""}</p>
            <p className="music-playing-artist">{track ? track.artist : ""}</p>
          </div>
        </div>
        <div className="music-playing-options">
          <div className="music-playing-buttons">
            <span onClick={handleShuffle}>
              <PlayRandomIcon isShuffle={shuffle} />
            </span>
            <span onClick={previousTrack}>
              <SkipBackIcon
                isClickable={
                  0 === allTracks?.findIndex((doc) => doc?.id === track?.id)
                }
              />
            </span>
            <span onClick={playAudio}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </span>
            <span onClick={nextTrack}>
              <SkipFwdIcon
                isClickable={
                  allTracks?.length - 1 ===
                  allTracks?.findIndex((doc) => doc?.id === track?.id)
                }
              />
            </span>
            <span onClick={handleRepeat}>
              <RepeatIcon repeat={repeat} />
            </span>
          </div>
          <div className="music-playing-slider">
            <input
              type="range"
              min={0}
              max={100}
              value={currentTime ? currentTime : 0}
              onChange={handleSliderChange}
              className="music-playing-sliders"
            />
            <div className="music-playing-timer">
              {formatTime(((currentTime ? currentTime : 0) * duration) / 100)} -{" "}
              {formatDuration(duration)}
            </div>
          </div>
        </div>
        <div className="music-playing-volume">
          <span onClick={changeVolume}>
            <VolUpIcon value={value} />
          </span>
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
