import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import OptionIcon from "../icons/OptionIcon";

function MusicCard({ musicItem }) {

    if (!musicItem) {
    return null; 
  }

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
      <p>{musicItem.title}</p>
      <p>{musicItem.album}</p>
      <p>{formatDuration(musicItem.duration)}</p>
      <OptionIcon />
    </div>
  );
}

function formatDuration(duration) {
    if (!duration) {
      return "--:--";
    }
  
    var minutes = Math.floor(duration / 60);
    var remainingSeconds = Math.floor(duration % 60);    
    return minutes + ":" + remainingSeconds;
  }

export default MusicCard;
