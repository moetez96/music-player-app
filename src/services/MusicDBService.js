import Localbase from "localbase";
import EventEmitter from "./EventEmitter";

const db = new Localbase("musicDB");

const selectTrack = async (musicItem) => {
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
  } catch (error) {
    console.error("Error updating track selection:", error);
  }
};

const getAllTracks = async () => {
  try {
    const tracks = await db.collection("tracks").get();
    return tracks;
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
};

const refreshMusicList = async () => {
  const result = { track: null, audioUrl: null };

  try {
    const listM = await db.collection("tracks").get();
    const index = await listM.findIndex((item) => item.selected);
    if (index !== -1) {
      const existingTrack = await db
        .collection("audioUrls")
        .doc({ id: listM[index].urlId })
        .get();
      result.track = listM[index];
      const audioUrl = URL.createObjectURL(
        new Blob([existingTrack.arrayBuffer])
      );
      result.audioUrl = audioUrl;
    }
  } catch (error) {
    console.error("Error fetching music list from LocalBase:", error);
  }

  return result;
};

export { selectTrack, getAllTracks, refreshMusicList };
