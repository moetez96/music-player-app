import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import DeleteIcon from "../icons/DeleteIcon";

function MusicCard({ musicItem }) {
  if (!musicItem) {
    return null;
  }

  const handleClick = () => {
    var listM = JSON.parse(localStorage.getItem("musicList")) || [];
    const index = listM.findIndex((item) => item.url === musicItem.url);
    if (index !== -1) {
      listM = listM.map((ele, i) => {
        if (i == index) {
          ele.selected = true;
        } else {
          ele.selected = false;
        }
        return ele;
      });

      localStorage.setItem("musicList", JSON.stringify(listM));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const removeMusic = () => {
    const listM = JSON.parse(localStorage.getItem("musicList")) || [];
    const index = listM.findIndex((item) => item.url === musicItem.url);

    if (index !== -1) {
      listM.splice(index, 1);
      localStorage.setItem("musicList", JSON.stringify(listM));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div
      className={`music-card ${musicItem.selected ? 'selected' : ''}`}
      onClick={handleClick}
    >
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
      <span onClick={removeMusic}>
        <DeleteIcon />
      </span>
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
