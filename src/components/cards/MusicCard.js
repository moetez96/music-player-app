import "../../styles/components/cards.scss";
import placeHolderImage from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import DeleteIcon from "../icons/DeleteIcon";
import EventEmitter from "../../services/EventEmitter";
import { formatDuration } from "../../utils/Shared";
import HeartIconRed from "../icons/HeartIconRed";
import { useEffect, useState } from "react";
import {
  deleteTrack,
  getAudioCover,
  getFavorite,
  handleFavoriteTrack,
  selectTrack,
} from "../../services/MusicDBService";

function MusicCard({ musicItem }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [image, setImage] = useState(placeHolderImage);

  useEffect(() => {
    setCurrentTrack(musicItem)
    const fetchCoverPicture = async () => {
      const coverPicture = await getAudioCover(musicItem);
      if (coverPicture) {
        setImage(
          coverPicture 
            ? coverPicture?.coverPicture ? coverPicture?.coverPicture : placeHolderImage
            : placeHolderImage
        );
      }
    };

    fetchCoverPicture();
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

  const removeMusic = async (event) => {
    event.stopPropagation();
    await deleteTrack(currentTrack);
  };

  const handleFavorite = async (event) => {
    event.stopPropagation();
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
        <img src={image} alt="music-card-img" className="music-card-img" />
        <span onClick={handleFavorite} className="music-card-fav-icon">
          {isFavorite ? <HeartIconRed /> : <HeartIcon />}
        </span>
      </span>
      <p>{currentTrack?.title}</p>
      <p>{currentTrack?.album}</p>
      <p>{currentTrack?.artist}</p>
      <p>{formatDuration(currentTrack?.duration)}</p>
      <span onClick={removeMusic} className="music-card-delete-icon">
        <DeleteIcon />
      </span>
    </div>
  );
}

export default MusicCard;
