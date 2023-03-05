import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const NewTrackRequest = Type.Object({
  playlistUrl: Type.String(),
  title: Type.String(),
  url: Type.String(),
});
type NewTrackRequestType = Static<typeof NewTrackRequest>;

export const addTrack: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: NewTrackRequestType;
      Reply: NewTrackRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: NewTrackRequest,
          response: {
            200: NewTrackRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_PLAYLIST_ADD_TRACK", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
