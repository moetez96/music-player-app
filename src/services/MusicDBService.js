import Localbase from "localbase";
import EventEmitter from "./EventEmitter";

const db = new Localbase("musicDB");


const loadTracksFromDB = async () => {
  const tracks = await db.collection("tracks").get();
  return tracks;
};

const selectTrack = async (musicItem) => {
  try {
    const existingTrack = await db
      .collection("tracks")
      .doc({ id: musicItem.id })
      .get();
    if (existingTrack !== null || existingTrack !== undefined) {
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
  const result = { tracks: [], track: null, audioUrl: null };

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
      result.tracks = listM;
    }
  } catch (error) {
    console.error("Error fetching music list from LocalBase:", error);
  }

  return result;
};

const deleteTrack = async (musicItem) => {
  try {
    await db.collection("tracks").doc({ id: musicItem.id }).delete();
    await db.collection("audioUrls").doc({ id: musicItem.urlId }).delete();
    EventEmitter.emit("tracksChanged");
  } catch (error) {
    console.error("Error deleting track:", error);
  }
};

const handleFavoriteTrack = async (musicItem) => {
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
      return false;
    } else {
      await db.collection("favoriteTracks").add({ favoriteId: musicItem.id });
      return true;
    }
  } catch (error) {
    console.error("Error saving favorite track to IndexedDB:", error);
  }
};

const getFavorite = async (musicItem) => {
  return await db
    .collection("favoriteTracks")
    .doc({ favoriteId: musicItem.id })
    .get();
};

const generateUniqueId = async (collection) => {
  let uniqueId;
  let existingTrack;
  do {
    uniqueId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(
      36
    );
    existingTrack = await db.collection(collection).doc({ id: uniqueId }).get();
  } while (existingTrack);
  return uniqueId;
};

const saveUrlToDB = async (arrayBuffer) => {
  try {
    const id = await generateUniqueId("audioUrls");
    const urlId = await db.collection("audioUrls").add({ id:id, arrayBuffer: arrayBuffer });
    return urlId.data.data.id;
  } catch (error) {
    console.error("Failed to save URL to IndexedDB:", error);
  }
};

const saveTrackToDB = async (track, arrayBuffer) => {
  try {
    const existingTrack = await db
      .collection("tracks")
      .doc({ title: track.title, album: track.album, artist: track.artist})
      .get();
    if (existingTrack) {
      console.log("Duplicate track found in IndexedDB:", track);
      return;
    }
    const urlId = await saveUrlToDB(arrayBuffer);
    const uniqueId = await generateUniqueId("tracks");
    await db.collection("tracks").add({ ...track, id: uniqueId, urlId: urlId });
    EventEmitter.emit("tracksChanged");
  } catch (error) {
    console.error("Error saving track to IndexedDB:", error);
  }
};

  const saveTrackToDBScan = async (track) => {
    try {
      const existingTrack = await db
        .collection("tracks")
        .doc({ title: track.title, album: track.album, artist: track.artist})
        .get();
      if (existingTrack) {
        console.log("Duplicate track found in IndexedDB:", track);
        return;
      }

      const urlId = await saveUrlToDB(track.urlId);
      const uniqueId = await generateUniqueId("tracks");

      await db.collection("tracks").add({ ...track, id: uniqueId, urlId: urlId });
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error saving track to IndexedDB:", error);
    }
  };

  const getAudioCover = async (musicItem) => {
    let query;
  
    if (musicItem.album.toLowerCase() === "unknown") {
      query = { title: musicItem.title, artist: musicItem.artist };
    } else {
      query = { artist: musicItem.artist, album: musicItem.album };
    }

    const coverPicture = await db.collection("audioCvr").doc(query).get();

    return coverPicture;
  };
  

  const saveAudioCoverToDB = async (musicItem, coverPic) => {
    try {
      const audioCvr = await db.collection("audioCvr").add({ 
        title: musicItem.title, 
        album: musicItem.album, 
        artist: musicItem.artist,
        coverPicture: coverPic
      });
      console.log(audioCvr);
    } catch (error) {
      console.error("Failed to save audioCvr to IndexedDB:", error);
    }
  };

export {
  loadTracksFromDB,
  selectTrack,
  getAllTracks,
  refreshMusicList,
  deleteTrack,
  handleFavoriteTrack,
  getFavorite,
  saveTrackToDB,
  saveUrlToDB,
  generateUniqueId,
  saveTrackToDBScan,
  getAudioCover,
  saveAudioCoverToDB
};
