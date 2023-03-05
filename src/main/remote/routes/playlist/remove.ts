import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const RemovePlaylistRequest = Type.Object({
  url: Type.String(),
});
type RemovePlaylistRequestType = Static<typeof RemovePlaylistRequest>;

export const remove: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: RemovePlaylistRequestType;
      Reply: RemovePlaylistRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: RemovePlaylistRequest,
          response: {
            200: RemovePlaylistRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_PLAYLIST_REMOVE", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
