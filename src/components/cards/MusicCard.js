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

  useEffect(() => {
    if (musicItem) {
      getFavorite(musicItem).then((existingTrack) =>
        setIsFavorite(existingTrack ? true : false)
      );
    }
  }, [musicItem]);

  const handleClick = async () => {
    await selectTrack(musicItem);
    EventEmitter.emit("tracksChanged");
  };

  const removeMusic = async () => {
    await deleteTrack(musicItem);
  };

  const handleFavorite = async () => {
    handleFavoriteTrack(musicItem)
      .then((result) => setIsFavorite(result))
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`music-card ${musicItem.selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span>
        <img
          src={musicPlaceholder}
          alt="music-card-img"
          className="music-card-img"
        />
        <span onClick={handleFavorite}>
          {isFavorite ? <HeartIconRed /> : <HeartIcon />}
        </span>
      </span>
      <p>{musicItem.title}</p>
      <p>{musicItem.album}</p>
      <p>{formatDuration(musicItem.duration)}</p>
      <span onClick={removeMusic}>
        <DeleteIcon />
      </span>
    </div>
  );
}

export default MusicCard;
