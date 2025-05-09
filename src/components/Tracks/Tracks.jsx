import { useEffect, useState } from "react";

import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";

import fetchJsonp from "fetch-jsonp";
import audioController from "../../utils/AudioController";

import s from "./Tracks.module.scss";

const Tracks = () => {
  const { tracks, setTracks, showTracks, setShowTracks } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const addedTracks = useStore((state) => state.addedTracks);


  useEffect(() => {
    if (tracks.length > TRACKS.length) {
      setShowTracks(true);
    }
  }, [tracks]);


  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      const userInput = e.target.value;
      getSongs(userInput);
    }
  };



  const getSongs = async (userInput) => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );
  
    if (response.ok) {
      response = await response.json();
  
      // const newDeezerTracks = response.data;
      const newDeezerTracks = response.data.map((track) => ({
        ...track,
        origin: "search",
      }));
  
      // Garder seulement les musiques locales (celles qui ont un "path")
      const localTracks = tracks.filter((track) => track.path);
  
      // Mettre à jour uniquement avec les locales + nouvelles de Deezer
      setTracks([...localTracks, ...newDeezerTracks]);
    }
  };
  


  const resetSearch = () => {
    setSearchInput(""); // Réinitialiser l'input
  
    const currentSrc = audioController.getCurrentSrc(); // Source actuelle
  
    // Est-ce que le morceau actuel vient de la liste TRACKS (locale)
    const isPlayingFromTracks = TRACKS.some((track) => track.path === currentSrc);
  
    // Arrêter la musique si ce n’est pas une piste locale
    if (!isPlayingFromTracks) {
      audioController.stop(); // 👈 Maintenant cette méthode fonctionne
      useStore.getState().setCurrentTrackSrc(null); // 👈 reset dans le store
      useStore.getState().setIsPlaying(false);
    }
  
    // Mettre à jour les pistes locales + celles ajoutées à la main
    fetchMetadata(TRACKS, [], (localTracks) => {
      const mergedTracks = [
        ...localTracks.filter((track) => track.preview || track.path),
        ...addedTracks.filter((track) => track.preview || track.path),
      ];
  
      setTracks(mergedTracks);
    });
  };
  
  
  
  

  return (
    <>
      <div
        className={s.toggleTracks}
        onClick={() => setShowTracks(!showTracks)}
      >
        tracklist
      </div>

      <section
        className={`
      ${s.wrapper}
      ${showTracks ? s.wrapper_visible : ""}`}
      >
        <div className={s.tracks}>
          <div className={s.header}>
            <span className={s.order}>#</span>
            <span className={s.title}>Titre</span>
            {/* <span className={s.artists}>Artistes</span> */}
            <span className={s.duration}>Durée</span>
          </div>

          {tracks.map((track, i) => {
            // Vérification si track.preview existe, sinon utiliser track.path
            const validSrc = track.preview || track.path;

            if (!validSrc) {
              console.warn(`Aucune source valide pour le morceau: ${track.title}`);
              return null; // Si aucune source valide, on ne rend pas ce morceau
            }

            return (
              <Track
                key={track.title + i}
                title={track.title}
                duration={track.duration}
                cover={track.album?.cover_xl || track.cover}
                src={validSrc}  
                path={track.path}
                preview={track.preview || null}
                index={i}
                artists={track.artist ? [track.artist.name] : track.artists}
                origin={track.origin}
              />
            );
          })}

        </div>

          <div className={s.searchContainer}>
            <input
              type="text"
              placeholder="Chercher un artiste"
              className={s.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && searchInput !== "") {
                  getSongs(searchInput);
                }
              }}
            />
            <button className={s.resetButton} onClick={resetSearch}>
              Réinitialiser
            </button>
        </div>
      </section>
    </>
  );
};

export default Tracks;
