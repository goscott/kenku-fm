import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const NewSoundboardRequest = Type.Object({
  title: Type.String(),
  url: Type.String(),
});
type NewSoundboardRequestType = Static<typeof NewSoundboardRequest>;

export const add: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: NewSoundboardRequestType;
      Reply: NewSoundboardRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: NewSoundboardRequest,
          response: {
            200: NewSoundboardRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_SOUNDBOARD_ADD", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
