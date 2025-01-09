import { create } from "zustand";
import TRACKS from "./TRACKS";

const useStore = create((set) => ({
  // defaultTracks

  // Liste qui a été traitée 
  tracks: [],
  setTracks: (_tracks) =>
    set(() => ({
      tracks: _tracks,
    })),
}));

export default useStore;
