import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import OptionIcon from "../icons/OptionIcon";

function MusicCard() {
  return (
    <div className="music-card">
      <span>
        <img
          src={musicPlaceholder}
          alt="music-card-img"
          className="music-card-img"
        />
        <HeartIcon />
      </span>
      <p>Let me love you ~ Krisx</p>
      <p>Single</p>
      <OptionIcon />
    </div>
  );
}

export default MusicCard;
