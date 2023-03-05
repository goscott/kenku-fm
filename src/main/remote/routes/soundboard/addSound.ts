import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";

import { PlayerManager } from "../../../managers/PlayerManager";
import { ReplyError, VIEW_ERROR } from "../..";

const NewSoundRequest = Type.Object({
  soundboardUrl: Type.String(),
  title: Type.String(),
  url: Type.String(),
});
type NewSoundRequestType = Static<typeof NewSoundRequest>;

export const addSound: (manager: PlayerManager) => FastifyPluginCallback =
  (manager) => (fastify, _, done) => {
    fastify.put<{
      Body: NewSoundRequestType;
      Reply: NewSoundRequestType | ReplyError;
    }>(
      "/",
      {
        schema: {
          body: NewSoundRequest,
          response: {
            200: NewSoundRequest,
          },
        },
      },
      (request, reply) => {
        const view = manager.getView();
        if (view) {
          view.send("PLAYER_REMOTE_SOUNDBOARD_ADD_SOUND", request.body);
          reply.status(200).send(request.body);
        } else {
          reply.status(503).send(VIEW_ERROR);
        }
      }
    );

    done();
  };
