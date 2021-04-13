import { CoreOutputType, Resolvers } from "../../type";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

type SendMessageArgs = {
  payload: string;
  roomId?: number;
  userId?: number;
};

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (
        _,
        { payload, roomId, userId }: SendMessageArgs,
        { client, loggedUser }
      ): Promise<CoreOutputType> => {
        try {
          let room = null;
          if (userId) {
            const user = await client.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                id: true,
              },
            });
            if (!user) {
              return {
                ok: false,
                error: "User does not exist",
              };
            }
            room = await client.room.create({
              data: {
                users: {
                  connect: [
                    {
                      id: userId,
                    },
                    {
                      id: loggedUser.id,
                    },
                  ],
                },
              },
            });
          } else if (roomId) {
            room = await client.room.findUnique({
              where: {
                id: roomId,
              },
              select: {
                id: true,
              },
            });
            if (!room) {
              return {
                ok: false,
                error: "Room not found.",
              };
            }
          }
          const message = await client.message.create({
            data: {
              payload,
              room: {
                connect: {
                  id: room.id,
                },
              },
              user: {
                connect: {
                  id: loggedUser.id,
                },
              },
            },
          });
          pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            error,
          };
        }
      }
    ),
  },
};

export default resolvers;
