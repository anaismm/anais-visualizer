import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";
import useStore from "../../utils/store"; 

import addMusic from "@assets/images/add-music.png";
import pauseIcon from "@assets/images/pause-icon.png"
import playIcon from "@assets/images/play-icon.png"

// eslint-disable-next-line react/prop-types
const Track = ({ title, cover, src, duration, artists, index, origin }) => {
  const { currentTrackSrc, setCurrentTrackSrc, tracks, addTrack, isPlaying, setIsPlaying } = useStore();

  const getSeconds = () => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };


  const togglePlayPause = () => {
    if (!src) {
      console.warn("Aucune source valide pour ce morceau");
      return;
    }
  
    const isSameTrack = currentTrackSrc === src;
  
    if (isSameTrack) {
      audioController.togglePlayPause(src);
      setIsPlaying(!isPlaying);
    } else {
      audioController.togglePlayPause(src);
      setCurrentTrackSrc(src);
      setIsPlaying(true);
      scene.cover.setCover(cover);
    }
  };
  
  

  const isActive = currentTrackSrc === src;
  const isPlayingThisTrack = isActive && isPlaying;
  const alreadyInList = tracks.some((track) => track.src === src);

  const shouldShowAddButton = origin === "search" && !alreadyInList;

  const handleAddClick = (e) => {
    e.stopPropagation();
    
    const newTrack = {
      title,
      artists,
      cover,
      src,         
      duration,
      path: src,   
      origin: "search",
    };
    
    addTrack(newTrack);
  };
  


  return (
    <div className={`${s.track} ${isActive ? s.active : ""}`} onClick={togglePlayPause}>
      <span className={s.order}>{index + 1}</span>

      <button
        className={s.playPauseButton}
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
      >
        <img
          src={isPlayingThisTrack ? pauseIcon : playIcon}
          alt={isPlayingThisTrack ? "Pause" : "Play"}
          className={s.playPauseIcon}
        />
      </button>

      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <span className={s.trackName}>{title}</span>
      </div>

      <span className={s.duration}>{getSeconds()}</span>

      {shouldShowAddButton && (
      <button className={s.addButton} onClick={handleAddClick} title="Ajouter cette musique à ma playlist">
        <img
          src={addMusic}
          alt="Ajouter la musique à ma playlist"
          className={s.addIcon}
        />
      </button>
    )}
    </div>
  );
};

export default Track;
