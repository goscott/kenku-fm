import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const RemoveSoundRequest = Type.Object({
  soundboardUrl: Type.String(),
  soundUrl: Type.String(),
});
type RemoveSoundRequestType = Static<typeof RemoveSoundRequest>;

export const removeSound: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: RemoveSoundRequestType;
      Reply: RemoveSoundRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: RemoveSoundRequest,
          response: {
            200: RemoveSoundRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_SOUNDBOARD_REMOVE_SOUND", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
