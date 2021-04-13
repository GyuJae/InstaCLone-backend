import { Resolvers, CoreOutputType } from "../../type";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { id }, { client, loggedUser }): Promise<CoreOutputType> => {
        try {
          const comment = await client.comment.findUnique({
            where: {
              id,
            },
            select: {
              userId: true,
            },
          });
          if (!comment) {
            return {
              ok: false,
              error: "Comment not found",
            };
          } else if (comment.userId !== loggedUser.id) {
            return {
              ok: false,
              error: "No authorized",
            };
          } else {
            await client.comment.delete({
              where: {
                id,
              },
            });
          }
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
