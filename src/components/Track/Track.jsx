import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";
import useStore from "../../utils/store"; 
import { useState } from "react";

import addMusic from "/images/add-music.png";
import pauseIcon from "/images/pause-icon.png"
import playIcon from "/images/play-icon.png"

const Track = ({ title, cover, src, duration, artists, index, path, preview, origin }) => {
  const { currentTrackSrc, setCurrentTrackSrc, tracks, addTrack, isPlaying, setIsPlaying } = useStore();

  
  console.log("track origin", origin);


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
  // const isPlaying = audioController.getIsPlaying() && isActive;
  // const alreadyInList = tracks.some((track) => track.src === src);
  // const alreadyInList = tracks.some((track) => track.path === src || track.preview === src);
  const alreadyInList = tracks.some((track) => track.src === src);
  // const isFromSearch = origin === "search";
  // const shouldShowAddButton = isFromSearch && !alreadyInList;

  const shouldShowAddButton = origin === "search" && !alreadyInList;

  const handleAddClick = (e) => {
    e.stopPropagation();
    
    // Utiliser src comme la source correcte ici
    const newTrack = {
      title,
      artists,
      cover,
      src,         
      duration,
      path: src,   
      origin: "search",
    };
  
    console.log("Ajout de track avec src:", src);
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
