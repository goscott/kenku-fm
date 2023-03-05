import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const RemoveTrackRequest = Type.Object({
  playlistUrl: Type.String(),
  trackUrl: Type.String(),
});
type RemoveTrackRequestType = Static<typeof RemoveTrackRequest>;

export const removeTrack: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: RemoveTrackRequestType;
      Reply: RemoveTrackRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: RemoveTrackRequest,
          response: {
            200: RemoveTrackRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_PLAYLIST_REMOVE_TRACK", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
