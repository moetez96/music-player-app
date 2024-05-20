import "../../styles/components/cards.scss";
import placeHolderImage from "../../styles/assets/images/music_placeholder.jpg";
import EventEmitter from "../../services/EventEmitter";
import { useEffect, useState } from "react";
import {
  getAudioCover,
  selectTrack,
} from "../../services/MusicDBService";

function SearchCard({ musicItem }) {
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

  const handleClick = async () => {
    await selectTrack(currentTrack);
    EventEmitter.emit("tracksChanged");
  };

  return (
    <div
      className={`search-card ${currentTrack?.selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span>
        <img src={image} alt="search-card-img" className="search-card-img" />
        <p>{currentTrack?.title}</p>
      </span>
      <p>{currentTrack?.artist}</p>
    </div>
  );
}

export default SearchCard;
