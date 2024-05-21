import React, { useState } from "react";
import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";
import {
  getAudioCover,
  saveAudioCoverToDB,
  saveTrackToDBScan,
} from "../../services/MusicDBService";
import { convertImageToBase64, getAudioBuffer } from "../../utils/Shared";
import { toast } from "react-toastify";

function ScanForMusic() {
  const [scanResult, setScanResult] = useState({addedTracks: 0, rejectedTracks: 0});
  console.log(scanResult)
  const handleFileChange = async (event) => {
    const fileList = event.target.files;
    const fileListArray = Array.from(fileList);

    const processFile = async (file) => {
      if (file.type.startsWith("audio/")) {
        const audio = new Audio();
        try {
          const tag = await new Promise((resolve, reject) => {
            jsmediatags.read(file, {
              onSuccess: resolve,
              onError: reject,
            });
          });

          const arrayBuffer = await getAudioBuffer(file);
          const cover = tag.tags.picture;
          console.log(tag.tags);
          const track = {
            id: 0,
            title: tag.tags.title || "Unknown",
            artist: tag.tags.artist || "Unknown",
            album: tag.tags.album || "Unknown",
            duration: 0,
            urlId: arrayBuffer,
            addDate: Date.now(),
            selected: false,
            genre: tag.tags.genre || "Unknown",
            composer: tag.tags["©wrt"]?.data || "Unknown",
            releaseDate: tag.tags.year || "Unknown",
            copyright: tag.tags["cprt"]?.data || "Unknown"
          };

          return new Promise((resolve, reject) => {
            audio.addEventListener("loadedmetadata", async function () {
              try {
                track.duration = audio.duration || 0;

                if (cover) {
                  const coverPictureExists = await getAudioCover(track);
                  if (!coverPictureExists) {
                    const coverPic = await convertImageToBase64(cover);
                    await saveAudioCoverToDB(track, coverPic);
                  }
                }

                await saveTrackToDBScan(track);
                resolve(true);
              } catch (error) {
                reject(false);
              }
            });

            audio.src = URL.createObjectURL(file);
            audio.load();
          });
        } catch (error) {
          console.error("Error processing file:", error);
          return false;
        }
      } else {
        return false;
      }
    };

    const processFiles = async () => {
      var addedCount = 0;
      var rejectedCount = 0;
    
      for (const file of fileListArray) {
        const result = await processFile(file);
        if (result) {
          addedCount++;
        } else {
          rejectedCount++;
        }
      }

      setScanResult({addedTracks: addedCount, rejectedTracks: rejectedCount});
    };

    const promise = processFiles();

    toast.promise(
      promise,
      {
        pending: 'Scanning and processing files...',
      }
    ).then(() => {
      console.log("Promise resolved!");
      toast(`Scan complete! Added tracks: ${scanResult.addedTracks}, Rejected tracks: ${scanResult.rejectedTracks}`);
    });
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
