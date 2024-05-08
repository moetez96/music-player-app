import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import DeleteIcon from "../icons/DeleteIcon";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function MusicCard({ musicItem }) {
  const db = new LocalBase("musicDB");

  const handleClick = async () => {
    try {
      const tracks = await db.collection("tracks").get();
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.id === musicItem.id) {
          track.selected = true;
        } else {
          track.selected = false;
        }
        await db.collection("tracks").doc({ id: track.id }).update(track);
      }
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error updating track selection:", error);
    }
  };

  const removeMusic = async () => {
    try {
      await db.collection("tracks").doc({ id: musicItem.id }).delete();
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error deleting track:", error);
    }
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
