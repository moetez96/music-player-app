import "../../styles/components/cards.scss";
import musicPlaceholder from "../../styles/assets/images/music_placeholder.jpg";
import HeartIcon from "../icons/HeartIcon";
import DeleteIcon from "../icons/DeleteIcon";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";
import { formatDuration } from "../../utils/Shared";
import HeartIconRed from "../icons/HeartIconRed";
import { useEffect, useState } from "react";

function MusicCard({ musicItem }) {
  const db = new LocalBase("musicDB");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    getFavorite();
  }, [musicItem])

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
      await db.collection("audioUrls").doc({ id: musicItem.urlId }).delete();
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error deleting track:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      const existingTrack = await db
        .collection("favoriteTracks")
        .doc({ favoriteId: musicItem.id })
        .get();
      if (existingTrack) {
        await db
          .collection("favoriteTracks")
          .doc({ favoriteId: musicItem.id })
          .delete();
      } else {
        await db.collection("favoriteTracks").add({ favoriteId: musicItem.id });
      }
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error saving favorite track to IndexedDB:", error);
    }
  };

  const getFavorite = async () => {
    const existingTrack = await db
      .collection("favoriteTracks")
      .doc({ favoriteId: musicItem.id })
      .get();

      setIsFavorite(existingTrack ? true : false);
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
