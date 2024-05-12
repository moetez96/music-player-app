import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import DeleteIcon from "../icons/DeleteIcon";
import EventEmitter from "../../services/EventEmitter";
import { formatDuration } from "../../utils/Shared";
import HeartIconRed from "../icons/HeartIconRed";
import { useEffect, useState } from "react";
import {
  deleteTrack,
  getFavorite,
  handleFavoriteTrack,
  selectTrack,
} from "../../services/MusicDBService";

function MusicCard({ musicItem }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    setCurrentTrack(musicItem);
  }, [musicItem]);

  useEffect(() => {
    if (currentTrack) {
      getFavorite(currentTrack).then((existingTrack) =>
        setIsFavorite(existingTrack ? true : false)
      );
    }
  }, [currentTrack]);

  const handleClick = async () => {
    await selectTrack(currentTrack);
    EventEmitter.emit("tracksChanged");
  };

  const removeMusic = async () => {
    await deleteTrack(currentTrack);
  };

  const handleFavorite = async () => {
    handleFavoriteTrack(currentTrack)
      .then((result) => setIsFavorite(result))
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`music-card ${currentTrack?.selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span>
        <img
          src={musicPlaceholder}
          alt="music-card-img"
          className="music-card-img"
        />
        <span onClick={handleFavorite} className="music-card-fav-icon">
          {isFavorite ? <HeartIconRed /> : <HeartIcon />}
        </span>
      </span>
      <p>{currentTrack?.title}</p>
      <p>{currentTrack?.album}</p>
      <p>{formatDuration(currentTrack?.duration)}</p>
      <span onClick={removeMusic} className="music-card-delete-icon">
        <DeleteIcon />
      </span>
    </div>
  );
}

export default MusicCard;
