import React from "react";
import UploadMusicIcon from "../icons/UploadMusicIcon";
import jsmediatags from "jsmediatags-web";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function UploadMusic() {
  const db = new LocalBase("musicDB");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith("audio/")) {
      const audio = new Audio();
      jsmediatags.read(file, {
        onSuccess(tag) {
          if (!tag || !tag.tags) {
            console.error("No tags found for the audio file.");
            return;
          }

          const url = URL.createObjectURL(file);
          audio.src = url;
          const track = {
            title: tag.tags.title || "Unknown",
            artist: tag.tags.artist || "Unknown",
            album: tag.tags.album || "Unknown",
            duration: 0,
            url: url,
            addDate: Date.now(),
            selected: false,
          };

          audio.addEventListener("loadedmetadata", function () {
            track.duration = audio.duration || 0;
            saveTrackToDB(track);
          });
          audio.load();
        },
        onError(error) {
          console.error("Error reading file metadata:", error);
        },
      });
    } else {
      console.error("Invalid file type. Please select an Audio file.");
    }
  };

  const saveTrackToDB = async (track) => {
    const existingTracks = await db
      .collection("tracks")
      .doc({ url: track.url })
      .get();

    if (existingTracks) {
      console.log("Duplicate track found in IndexedDB:", track);
      return;
    }

    try {
      await db.collection("tracks").add({ ...track });
      console.log("Track saved to IndexedDB:", track);
      EventEmitter.emit("tracksChanged"); // Notify changes
    } catch (error) {
      console.error("Failed to save track to IndexedDB:", error);
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
        Upload Music
      </label>
    </>
  );
}

export default UploadMusic;
