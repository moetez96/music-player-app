import ScanForMusicIcon from "../icons/ScanForMusicIcon";
import jsmediatags from "jsmediatags-web";
import {
  getAudioCover,
  saveAudioCoverToDB,
  saveTrackToDBScan,
} from "../../services/MusicDBService";
import { convertImageToBase64, getAudioBuffer } from "../../utils/Shared";

function ScanForMusic() {
  const handleFileChange = async (event) => {
    const fileList = event.target.files;
    const fileListArray = Array.from(fileList);

    for (const file of fileListArray) {
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

          await new Promise((resolve, reject) => {
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
                resolve();
              } catch (error) {
                reject(error);
              }
            });

            audio.src = URL.createObjectURL(file);
            audio.load();
          });
        } catch (error) {
          console.error("Error processing file:", error);
        }
      }
    }
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