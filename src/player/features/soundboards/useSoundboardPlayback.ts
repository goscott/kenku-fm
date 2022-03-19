import { useCallback, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  playSound,
  updatePlayback,
  stopSound,
} from "./soundboardPlaybackSlice";
import { Sound as SoundType } from "./soundboardsSlice";
import { Sound } from "./Sound";

export function useSoundboardPlayback(onError: (message: string) => void) {
  const soundsRef = useRef<Record<string, Sound>>({});
  const soundboards = useSelector((state: RootState) => state.soundboards);
  const dispatch = useDispatch();

  const play = useCallback(
    (sound: SoundType) => {
      if (soundsRef.current[sound.id]) {
        soundsRef.current[sound.id].stop(false);
        delete soundsRef.current[sound.id];
      }

      const loop = new Sound({
        src: sound.url,
        volume: sound.volume,
        fadeIn: sound.fadeIn,
        fadeOut: sound.fadeOut,
        loop: sound.loop,
      });

      loop.once("load", (duration) => {
        dispatch(
          playSound({
            sound,
            duration: Math.floor(duration),
          })
        );
      });

      loop.on("end", () => {
        if (!sound.loop) {
          dispatch(stopSound(sound.id));
          soundsRef.current[sound.id]?.stop(false);
          delete soundsRef.current[sound.id];
        }
      });

      loop.on("error", () => {
        delete soundsRef.current[sound.id];
        dispatch(stopSound(sound.id));
        onError(`Unable to play sound: ${sound.title}`);
      });

      soundsRef.current[sound.id] = loop;
    },
    [onError]
  );

  useEffect(() => {
    // Update playback
    let handler = requestAnimationFrame(animatePlayback);
    let prevTime = performance.now();
    function animatePlayback(time: number) {
      handler = requestAnimationFrame(animatePlayback);
      // Limit update to 1 time per 200 ms
      const delta = time - prevTime;
      if (delta > 200) {
        for (let id in soundsRef.current) {
          const loop = soundsRef.current[id];
          if (loop.playing()) {
            dispatch(updatePlayback({ id, progress: loop.progress() }));
          }
        }
        prevTime = time;
      }
    }
    return () => {
      cancelAnimationFrame(handler);
    };
  }, []);

  const seek = useCallback((id: string, to: number) => {
    dispatch(updatePlayback({ id, progress: to }));
    soundsRef.current[id]?.seek(to);
  }, []);

  const stop = useCallback(async (id: string) => {
    dispatch(stopSound(id));
    const loop = soundsRef.current[id];
    if (loop) {
      await loop.stop(true);
      delete soundsRef.current[id];
    }
  }, []);

  useEffect(() => {
    for (let [id, sound] of Object.entries(soundsRef.current)) {
      const state = soundboards.sounds[id];
      if (state && state.volume !== sound.options.volume) {
        sound.volume(state.volume);
      }
    }
  }, [soundboards]);

  return {
    seek,
    play,
    stop,
  };
}
