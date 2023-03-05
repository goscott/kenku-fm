import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const NewPlaylistRequest = Type.Object({
  title: Type.String(),
  url: Type.String(),
});
type NewPlaylistRequestType = Static<typeof NewPlaylistRequest>;

export const add: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: NewPlaylistRequestType;
      Reply: NewPlaylistRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: NewPlaylistRequest,
          response: {
            200: NewPlaylistRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_PLAYLIST_ADD", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
