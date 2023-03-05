import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const RemoveSoundboardRequest = Type.Object({
  url: Type.String(),
});
type RemoveSoundboardRequestType = Static<typeof RemoveSoundboardRequest>;

export const remove: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: RemoveSoundboardRequestType;
      Reply: RemoveSoundboardRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: RemoveSoundboardRequest,
          response: {
            200: RemoveSoundboardRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_SOUNDBOARD_REMOVE", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
