import { useState } from "react";
import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";
import LocalBase from "localbase";
import EventEmitter from "../../services/EventEmitter";

function ScanForMusic() {
  const [tracks, setTracks] = useState([]);
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

  const saveUrlToDB = async (arrayBuffer) => {
    try {
      const id = await generateUniqueId("audioUrls");
      const urlId = await db.collection("audioUrls").add({ id:id, arrayBuffer: arrayBuffer });
      return urlId.data.data.id;
    } catch (error) {
      console.error("Failed to save URL to IndexedDB:", error);
    }
  };

  const saveTrackToDB = async (track) => {
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

      await db.collection("tracks").add({ ...track, urlId: urlId });
      EventEmitter.emit("tracksChanged");
    } catch (error) {
      console.error("Error saving track to IndexedDB:", error);
    }
  };

  const handleFileChange = async (event) => {
    const fileList = event.target.files;
    const fileListArray = Array.from(fileList);

    const promises = fileListArray.map(async (file) => {
      if (file.type.startsWith("audio/")) {
        const reader = new FileReader();
        const audio = new Audio();

        return new Promise(async (resolve, reject) => {
          reader.onload = async () => {
            try {
              const tag = await new Promise((resolve, reject) => {
                jsmediatags.read(file, {
                  onSuccess: resolve,
                  onError: reject,
                });
              });

              const arrayBuffer = reader.result;


              const track = {
                id: 0,
                title: tag.tags.title || "Unknown",
                artist: tag.tags.artist || "Unknown",
                album: tag.tags.album || "Unknown",
                duration: 0,
                urlId: arrayBuffer,
                addDate: Date.now(),
                selected: false,
              };

              audio.addEventListener("loadedmetadata", async function () {
                track.duration = audio.duration || 0;
                resolve(track);
              });

              audio.src = URL.createObjectURL(file);
              audio.load();
            } catch (error) {
              console.error("Error reading file metadata:", error);
              resolve(null);
            }
          };
          reader.readAsArrayBuffer(file);
        });
      } else {
        return null;
      }
    });

    const processedTracks = await Promise.all(promises);
    const filteredTracks = processedTracks.filter((track) => track !== null);

    const tracksWithUniqueIds = await Promise.all(
      filteredTracks.map(async (track) => ({
        ...track,
        id: await generateUniqueId("tracks",),
      }))
    );

    setTracks([...tracks, ...tracksWithUniqueIds]);
    tracksWithUniqueIds.forEach(saveTrackToDB);
  };

  return (
    <>
      <div>
        <input
          type="file"
          id="scan-music"
          directory=""
          webkitdirectory=""
          multiple
          onChange={handleFileChange}
        />
      </div>
      <label htmlFor="scan-music" className="upload-button">
        <ScanForMusicIcon />
        Scan your device for music
      </label>
    </>
  );
}

export default ScanForMusic;