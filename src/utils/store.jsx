import { create } from "zustand";

const useStore = create((set, get) => ({
  tracks: [],
  addedTracks: [],

  showTracks: false,
  setShowTracks: (value) => set({ showTracks: value }),

  setTracks: (_tracks) =>
    set(() => ({
      tracks: _tracks,
    })),

  currentTrackSrc: null,
  setCurrentTrackSrc: (src) =>
    set(() => ({
      currentTrackSrc: src,
    })),

    isPlaying: false,
    setIsPlaying: (value) => set({ isPlaying: value }),

    isLooping: false,
    setIsLooping: (value) => set({ isLooping: value }),

    addTrack: (newTrack) => {
      const currentTracks = get().tracks;
      const currentAdded = get().addedTracks;
    
      const alreadyInTracks = currentTracks.some((track) => track.src === newTrack.src);
      const alreadyInAdded = currentAdded.some((track) => track.src === newTrack.src);
    
      if (!alreadyInTracks) {
        set({ tracks: [...currentTracks, newTrack] });
      }
    
      if (!alreadyInAdded) {
        set({ addedTracks: [...currentAdded, newTrack] });
      }
    },
    
    
}));

export default useStore;