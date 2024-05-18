import { useState } from "react";
import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";
import { generateUniqueId, getAudioCover, saveAudioCoverToDB, saveTrackToDBScan } from "../../services/MusicDBService";
import { convertImageToBase64 } from "../../utils/Shared";

function ScanForMusic() {
  const [tracks, setTracks] = useState([]);

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
              const cover = tag.tags.picture;

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

                if (cover) {
                  const coverPictureExists  = await getAudioCover(track);
                  if (!coverPictureExists) {
                    const coverPic = convertImageToBase64(cover)
  
                    await saveAudioCoverToDB(track, coverPic)
                  }
                } 

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
    tracksWithUniqueIds.forEach(saveTrackToDBScan);
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
        <span>Scan your device for music</span>
      </label>
    </>
  );
}

export default ScanForMusic;