import { Resolvers, CoreOutputType } from "../../type";
import { protectedResolver } from "../../users/users.utils";

type EditCommentArgs = {
  id: number;
  payload: string;
};

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (
        _,
        { id, payload }: EditCommentArgs,
        { client, loggedUser }
      ): Promise<CoreOutputType> => {
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
              error: "Comment Not found",
            };
          } else if (comment.userId !== loggedUser.id) {
            return {
              ok: false,
              error: "Not authorized",
            };
          } else {
            await client.comment.update({
              where: {
                id,
              },
              data: {
                payload,
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
