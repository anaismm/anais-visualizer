import { useState, useEffect } from "react";
import useStore from "../../utils/store";
import s from "./TrackPlaying.module.scss";
import audioController from "../../utils/AudioController";  

const TrackPlaying = () => {
  const { currentTrackSrc, setCurrentTrackSrc, tracks, showTracks , isPlaying, setIsPlaying } = useStore();
  const [isLooping, setIsLooping] = useState(audioController.isLooping);

  // const [isPlaying, setIsPlaying] = useState(false); 
  
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
  
  

  // Previous tracks
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
  
  
  // Next tracks
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
     
     
        {/* <button onClick={toggleLoop} className={s.loopButton}>
          <img
            src={isLooping ? "/images/loop-on-icon.svg" : "/images/loop-off-icon.png"}
            alt={isLooping ? "Désactiver la boucle" : "Activer la boucle"}
            className={s.loopIcon}
          />
        </button>   */}
        {/* Boutons controles */}
        {/* <div className={s.controlsButton}> 

        <button className={s.prevButton} onClick={goToPreviousTrack}>
          <img
            src="/images/next-icon.svg"
            alt="Previous"
            className={s.prevMusic}
          />
        </button> */}

          {/* Bouton Play/Pause */}
          {/* <button className={s.playPauseButton} onClick={togglePlayPause}>
            <img
              src={isPlaying ? "/images/pause-icon.png" : "/images/play-icon.png"}  // Change l'icône en fonction de l'état
              alt={isPlaying ? "Pause" : "Play"}
              className={s.playPauseIcon}
            />
          </button>
        
          <button className={s.nextButton} onClick={goToNextTrack}>
            <img
              src="/images/next-icon.svg"
              alt="Next"
              className={s.nextMusic}
            />
          </button>
        </div> */}
    

    <div className={s.controlsRow}>
  <button onClick={toggleLoop} className={s.loopButton}>
    <img
      src={isLooping ? "/images/loop-on-icon.svg" : "/images/loop-off-icon.png"}
      alt={isLooping ? "Désactiver la boucle" : "Activer la boucle"}
      className={s.loopIcon}
    />
  </button>

      <div className={s.controlsButton}> 
        <button className={s.prevButton} onClick={goToPreviousTrack}>
          <img
            src="/images/next-icon.svg"
            alt="Previous"
            className={s.prevMusic}
          />
        </button>

        <button className={s.playPauseButton} onClick={togglePlayPause}>
          <img
            src={isPlaying ? "/images/pause-icon.png" : "/images/play-icon.png"}
            alt={isPlaying ? "Pause" : "Play"}
            className={s.playPauseIcon}
          />
        </button>

        <button className={s.nextButton} onClick={goToNextTrack}>
          <img
            src="/images/next-icon.svg"
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
