import { Resolvers, CoreOutputType } from "../../type";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: protectedResolver(
      async (_, { id }, { loggedUser, client }): Promise<CoreOutputType> => {
        try {
          const message = await client.message.findFirst({
            where: {
              id,
              userId: {
                not: loggedUser.id,
              },
              room: {
                users: {
                  some: {
                    id: loggedUser.id,
                  },
                },
              },
            },
          });
          if (!message) {
            return {
              ok: false,
              error: "Message not found",
            };
          }
          await client.message.update({
            where: {
              id,
            },
            data: {
              read: true,
            },
          });
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
