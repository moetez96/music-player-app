import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { fetchAudioUrl, selectTrack } from "../services/MusicDBService";
import { toast } from "react-toastify";

function MusicPlayer({ favoriteMusicList, musicList, coverPicture, isFavoritesRoute, overView, updateOverView }) {
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
  }, [coverPicture, favoriteMusicList, musicList, isFavoritesRoute]);

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value-volume", value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  }, [value]);

  useEffect(() => {
    document.documentElement.style.setProperty("--slider-value-duration", currentTime);
  }, [currentTime]);

  useEffect(() => {
    const updateTrack = async () => {
      if (allTracks.length > 0) {
        const selectedTrack = allTracks.find((track) => track.selected);
        if (selectedTrack && selectedTrack !== track) {
          setTrack(selectedTrack);
          try {
            const audioUrl = await fetchAudioUrl(selectedTrack.urlId);
            if (audioUrl) {
              audioRef.current.src = audioUrl;
              audioRef.current.addEventListener("loadedmetadata", () => {
                setDuration(audioRef.current.duration);
                if (firstMount) {
                  setFirstMount(false);
                }
                if (!repeat) {
                  setIsPlaying(false);
                }
                if (track && repeat != null && !firstMount && isPlaying) {
                  setTimeout(() => {
                    setIsPlaying(true);
                    audioRef.current.play();
                  }, 100);
                }
              });
            } else {
              toast.error("Audio URL not found.");
            }
          } catch (error) {
            console.error(error);
            toast.error("The track audio is corrupted.");
          }
        }
      }
    };

    updateTrack();
  }, [allTracks]);

  const handleInputChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const changeVolume = useCallback(() => {
    setValue((prevValue) => {
      if (prevValue < 20 && prevValue !== 0) {
        return 0;
      } else if (prevValue === 0) {
        return 100;
      } else {
        return prevValue / 2;
      }
    });
  }, []);

  const playAudio = useCallback(async () => {
    if (isPlaying) {
      await audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, [isPlaying]);

  const handleRepeat = useCallback(() => {
    setRepeat((prevRepeat) => {
      switch (prevRepeat) {
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
  }, []);

  const handleShuffle = useCallback(() => {
    setShuffle((prevShuffle) => !prevShuffle);
  }, []);

  const nextTrack = useCallback(async () => {
    if (!allTracks || allTracks.length === 0) {
      console.log("No tracks found");
      return;
    }

    const trackIndex = allTracks.findIndex((doc) => doc.id === track.id);

    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allTracks.length);
      } while (randomIndex === trackIndex);

      await selectTrack(allTracks[randomIndex]);
      EventEmitter.emit("tracksChanged");
    } else if (trackIndex !== -1 && trackIndex < allTracks.length - 1) {
      await selectTrack(allTracks[trackIndex + 1]);
      EventEmitter.emit("tracksChanged");
    } else {
      setIsPlaying(false);
      console.log("Reached the end of the playlist");
    }
    }, [allTracks, shuffle, track]);

  const previousTrack = useCallback(async () => {
    if (!allTracks || allTracks.length === 0) {
      console.log("No tracks found");
      return;
    }

    const trackIndex = allTracks.findIndex((doc) => doc.id === track.id);
    if (trackIndex !== -1 && trackIndex > 0) {
      await selectTrack(allTracks[trackIndex - 1]);
      EventEmitter.emit("tracksChanged");
    } else {
      setIsPlaying(false);
      console.log("No tracks found");
    }
  }, [allTracks, track]);

  const handleSliderChange = useCallback((event) => {
    audioRef.current.currentTime = (event.target.value / 100) * duration;
    setCurrentTime(event.target.value);
    document.documentElement.style.setProperty("--slider-value-duration", currentTime);
  }, [duration, currentTime]);

  const updateTime = useCallback(async () => {
    setCurrentTime((audioRef.current.currentTime / duration) * 100);

    if (audioRef.current.ended) {
      if (repeat === "One") {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else if (repeat === "All") {
        await nextTrack();
      } else {
        setIsPlaying(false);
      }
    }
  }, [duration, nextTrack, repeat]);

  const handleOverViewClick = useCallback(() => {
    updateOverView((prevOverView) => !prevOverView);
  }, [updateOverView]);

  return (
      <div className="player-wrapper">
        <div>
          <audio ref={audioRef} controls onTimeUpdate={updateTime} style={{ display: "none" }} />
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
                  isClickable={0 === allTracks?.findIndex((doc) => doc?.id === track?.id)}
              />
            </span>
              <span onClick={playAudio}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </span>
              <span onClick={nextTrack}>
              <SkipFwdIcon
                  isClickable={allTracks?.length - 1 === allTracks?.findIndex((doc) => doc?.id === track?.id)}
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
                {formatDuration(((currentTime ? currentTime : 0) * duration) / 100)} - {formatDuration(duration)}
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
