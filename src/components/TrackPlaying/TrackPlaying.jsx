import { useState, useEffect } from "react";
import useStore from "../../utils/store";
import s from "./TrackPlaying.module.scss";
import audioController from "../../utils/AudioController";  

import loopOn from "@assets/images/loop-on-icon.svg";
import loopOff from "@assets/images/loop-off-icon.png";
import pauseIcon from "@assets/images/pause-icon.png";
import playIcon from "@assets/images/play-icon.png";
import nextIcon from "@assets/images/next-icon.svg";

const TrackPlaying = () => {
  const { currentTrackSrc, setCurrentTrackSrc, tracks, showTracks , isPlaying, setIsPlaying } = useStore();
  const [isLooping, setIsLooping] = useState(audioController.isLooping);

  const currentTrack = tracks.find((t) => t.preview === currentTrackSrc || t.path === currentTrackSrc);
  
  const togglePlayPause = () => {
    if (!currentTrackSrc) return;
  
    audioController.togglePlayPause(currentTrackSrc);
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    audioController.toggleLoop();
    setIsLooping(audioController.isLooping); 
  };
  

  // Previous track
  const goToPreviousTrack = () => {
    const currentIndex = tracks.findIndex(
      (t) => t.preview === currentTrackSrc || t.path === currentTrackSrc
    );
  
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
  
    const prevTrack = tracks[prevIndex];
    setIsPlaying(true);
    setCurrentTrackSrc(prevTrack.path || prevTrack.preview);
    audioController.play(prevTrack.path || prevTrack.preview);
  };
  
  
  // Next track
  const goToNextTrack = () => {
    const currentIndex = tracks.findIndex(
      (t) => t.preview === currentTrackSrc || t.path === currentTrackSrc
    );
  
    const nextIndex = (currentIndex + 1) % tracks.length;
  
    const nextTrack = tracks[nextIndex];
    setIsPlaying(true);
    setCurrentTrackSrc(nextTrack.path || nextTrack.preview);
    audioController.play(nextTrack.path || nextTrack.preview);
  };
  

  useEffect(() => {
    audioController.setOnTrackEnd(goToNextTrack);
  }, [tracks, currentTrackSrc]);
  
  
  if (showTracks || !currentTrack) return null;
  



  return (
    <div className={s.trackPlaying}>
      <img src={currentTrack.album?.cover_xl || currentTrack.cover} alt="Cover" className={s.cover} />
     
     

    <div className={s.controlsRow}>
  <button onClick={toggleLoop} className={s.loopButton}>
    <img
      src={isLooping ? loopOn : loopOff}
      alt={isLooping ? "Désactiver la boucle" : "Activer la boucle"}
      className={s.loopIcon}
    />
  </button>

      <div className={s.controlsButton}> 
        <button className={s.prevButton} onClick={goToPreviousTrack}>
          <img
            src={nextIcon}
            alt="Previous"
            className={s.prevMusic}
          />
        </button>

        <button className={s.playPauseButton} onClick={togglePlayPause}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            alt={isPlaying ? "Pause" : "Play"}
            className={s.playPauseIcon}
          />
        </button>

        <button className={s.nextButton} onClick={goToNextTrack}>
          <img
            src={nextIcon}
            alt="Next"
            className={s.nextMusic}
          />
        </button>
      </div>
    </div>


      {/* Details titre + artiste  */}
      <div className={s.details}>
        <span className={s.title}>{currentTrack.title}</span>
        <span className={s.artist}>
          {Array.isArray(currentTrack.artists) ? currentTrack.artists.join(", ") : currentTrack.artist?.name || "Inconnu"}
        </span>
      </div>
      
     
    </div>
  );
};

export default TrackPlaying;
