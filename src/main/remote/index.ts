import { PlayerManager } from "../managers/PlayerManager";
import { get as playlistGet } from "./routes/playlist";
import { play as playlistPlay } from "./routes/playlist/play";
import { add as playlistAdd } from "./routes/playlist/add";
import { addTrack as playlistAddTrack } from "./routes/playlist/addTrack";
import { remove as playlistRemove } from "./routes/playlist/remove";
import { removeTrack as playlistRemoveTrack } from "./routes/playlist/removeTrack";
import { playback as playlistPlayback } from "./routes/playlist/playback";
import { get as soundboardGet } from "./routes/soundboard";
import { play as soundboardPlay } from "./routes/soundboard/play";
import { stop as soundboardStop } from "./routes/soundboard/stop";
import { playback as soundboardPlayback } from "./routes/soundboard/playback";
import { add as soundboardAdd } from "./routes/soundboard/add";
import { addSound as soundboardAddSound } from "./routes/soundboard/addSound";
import { remove as soundboardRemove } from "./routes/soundboard/remove";
import { removeSound as soundboardRemoveSound } from "./routes/soundboard/removeSound";

export type ReplyError = {
  statusCode: number;
  error: string;
  message: string;
};

export const VIEW_ERROR: ReplyError = {
  statusCode: 503,
  error: "Service Unavailable",
  message: "Unable to connect to Kenku FM",
};

export function registerRemote(manager: PlayerManager) {
  manager.fastify.register(playlistGet(manager), {
    prefix: "/v1/playlist",
  });
  manager.fastify.register(playlistAdd(manager), {
    prefix: "/v1/playlist/add",
  });
  manager.fastify.register(playlistAddTrack(manager), {
    prefix: "/v1/playlist/addTrack",
  });
  manager.fastify.register(playlistRemove(manager), {
    prefix: "/v1/playlist/remove",
  });
  manager.fastify.register(playlistRemoveTrack(manager), {
    prefix: "/v1/playlist/removeTrack",
  });
  manager.fastify.register(playlistPlay(manager), {
    prefix: "/v1/playlist/play",
  });
  manager.fastify.register(playlistPlayback(manager), {
    prefix: "/v1/playlist/playback",
  });
  manager.fastify.register(soundboardGet(manager), {
    prefix: "/v1/soundboard",
  });
  manager.fastify.register(soundboardAdd(manager), {
    prefix: "/v1/soundboard/add",
  });
  manager.fastify.register(soundboardAddSound(manager), {
    prefix: "/v1/soundboard/addSound",
  });
  manager.fastify.register(soundboardRemove(manager), {
    prefix: "/v1/soundboard/remove",
  });
  manager.fastify.register(soundboardRemoveSound(manager), {
    prefix: "/v1/soundboard/removeSound",
  });
  manager.fastify.register(soundboardPlay(manager), {
    prefix: "/v1/soundboard/play",
  });
  manager.fastify.register(soundboardStop(manager), {
    prefix: "/v1/soundboard/stop",
  });
  manager.fastify.register(soundboardPlayback(manager), {
    prefix: "/v1/soundboard/playback",
  });
}
