import { Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";

type CreateCommentArgs = {
  photoId: number;
  payload: string;
};

type CreateCommentResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (
        _,
        { photoId, payload }: CreateCommentArgs,
        { client, loggedUser }
      ): Promise<CreateCommentResult> => {
        try {
          const ok = await client.photo.findUnique({
            where: {
              id: photoId,
            },
            select: {
              id: true,
            },
          });
          if (!ok) {
            return {
              ok: false,
              error: "Photo not found",
            };
          }
          await client.comment.create({
            data: {
              payload,
              photo: {
                connect: {
                  id: photoId,
                },
              },
              user: {
                connect: {
                  id: loggedUser.id,
                },
              },
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
