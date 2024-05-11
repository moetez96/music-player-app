import React from "react";
import UploadMusicIcon from "../icons/UploadMusicIcon";
import jsmediatags from "jsmediatags-web";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function UploadMusic() {
  const db = new LocalBase("musicDB");

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("audio/")) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        jsmediatags.read(file, {
          onSuccess(tag) {
            if (!tag || !tag.tags) {
              console.error("No tags found for the audio file.");
              return;
            }

            const track = {
              id: 0,
              title: tag.tags.title || "Unknown",
              artist: tag.tags.artist || "Unknown",
              album: tag.tags.album || "Unknown",
              duration: 0,
              urlId: null,
              addDate: Date.now(),
              selected: false,
            };

            const audio = new Audio();
            const url = URL.createObjectURL(file);
            audio.src = url;

            audio.addEventListener("loadedmetadata", async function () {
              track.duration = audio.duration || 0;
              saveTrackToDB(track, arrayBuffer);
            });

            audio.load();
          },
          onError(error) {
            console.error("Error reading file metadata:", error);
          },
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    } else {
      console.error("Invalid file type. Please select an Audio file.");
    }
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

  return (
    <>
      <input
        id="upload-music"
        type="file"
        accept="audio"
        onChange={handleFileChange}
        className="upload-music-button"
        hidden
      />
      <label htmlFor="upload-music" className="upload-button">
        <UploadMusicIcon />
        <span>Upload Music</span>
      </label>
    </>
  );
}

export default UploadMusic;
