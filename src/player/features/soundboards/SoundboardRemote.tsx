import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { backgrounds } from "../../backgrounds";
import { RootState } from "../../app/store";
import { v4 as uuid } from "uuid";
import {
  addSound,
  addSoundboard,
  removeSound,
  removeSoundboard,
  Sound,
} from "./soundboardsSlice";

type SoundboardRemoteProps = {
  onPlay: (sound: Sound) => void;
  onStop: (id: string) => void;
};

export function SoundboardRemote({ onPlay, onStop }: SoundboardRemoteProps) {
  const dispatch = useDispatch();
  const soundboards = useSelector((state: RootState) => state.soundboards);
  const playback = useSelector((state: RootState) => state.soundboardPlayback);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_PLAY", (args) => {
      const id = args[0];

      if (id in soundboards.sounds) {
        const sound = soundboards.sounds[id];
        onPlay(sound);
      } else if (id in soundboards.soundboards.byId) {
        const soundboard = soundboards.soundboards.byId[id];
        const sounds = [...soundboard.sounds];
        const soundId = sounds[Math.floor(Math.random() * sounds.length)];
        const sound = soundboards.sounds[soundId];
        if (sound) {
          onPlay(sound);
        }
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_PLAY");
    };
  }, [onPlay, soundboards]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_STOP", (args) => {
      const id = args[0];
      onStop(id);
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_STOP");
    };
  }, [onPlay, soundboards]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_PLAYBACK_REQUEST", () => {
      const sounds = Object.values(playback.playback);
      window.player.soundboardPlaybackReply({
        sounds,
      });
    });

    return () => {
      window.player.removeAllListeners(
        "PLAYER_REMOTE_SOUNDBOARD_PLAYBACK_REQUEST"
      );
    };
  }, [playback]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_GET_ALL_REQUEST", () => {
      window.player.soundboardGetAllReply({
        soundboards: soundboards.soundboards.allIds.map(
          (id) => soundboards.soundboards.byId[id]
        ),
        sounds: Object.values(soundboards.sounds),
      });
    });
  }, [soundboards]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_ADD", (args) => {
      const existingSoundboardId = soundboards.soundboards.allIds.find(
        (id: string) => soundboards.soundboards.byId[id].url === args[0].url
      );
      if (
        !existingSoundboardId &&
        !args[0].title.toLowerCase().includes("folder") // ignore "new folder"
      ) {
        const id = uuid();
        dispatch(
          addSoundboard({
            id,
            title: args[0].title,
            background: Object.keys(backgrounds)[0],
            sounds: [],
            url: args[0].url,
          })
        );
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_ADD");
    };
  }, [soundboards, addSoundboard]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_ADD_SOUND", (args) => {
      const soundboardId = soundboards.soundboards.allIds.find(
        (id: string) =>
          soundboards.soundboards.byId[id].url === args[0].soundboardUrl
      );
      if (soundboardId) {
        const soundAlreadyInSoundboard = soundboards.soundboards.byId[
          soundboardId
        ].sounds.some((soundId) => {
          return soundboards.sounds[soundId].url === args[0].url;
        });
        if (!soundAlreadyInSoundboard) {
          dispatch(
            addSound({
              soundboardId,
              sound: {
                id: uuid(),
                url: args[0].url,
                title: args[0].title,
                loop: args[0].loop,
                volume: args[0].volume,
                fadeIn: args[0].fadeIn,
                fadeOut: args[0].fadeOut,
              },
            })
          );
        }
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_ADD_SOUND");
    };
  }, [soundboards, addSound]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_REMOVE", (args) => {
      const soundboardId = soundboards.soundboards.allIds.find(
        (id: string) => soundboards.soundboards.byId[id].url === args[0].url
      );
      if (soundboardId) {
        dispatch(removeSoundboard(soundboardId));
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_REMOVE");
    };
  }, [soundboards, removeSoundboard]);

  useEffect(() => {
    window.player.on("PLAYER_REMOTE_SOUNDBOARD_REMOVE_SOUND", (args) => {
      const soundboardId = soundboards.soundboards.allIds.find(
        (id: string) =>
          soundboards.soundboards.byId[id].url === args[0].soundboardUrl
      );
      const soundId = Object.keys(soundboards.sounds).find(
        (id: string) => soundboards.sounds[id].url === args[0].soundUrl
      );
      if (soundboardId && soundId) {
        dispatch(
          removeSound({
            soundboardId,
            soundId,
          })
        );
      }
    });

    return () => {
      window.player.removeAllListeners("PLAYER_REMOTE_SOUNDBOARD_REMOVE_SOUND");
    };
  }, [soundboards, removeSound]);

  return <></>;
}
