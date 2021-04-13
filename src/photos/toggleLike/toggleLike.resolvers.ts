import { Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";

type ToggleLikeResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id }, { loggedUser, client }): Promise<ToggleLikeResult> => {
        try {
          const photo = await client.photo.findUnique({
            where: {
              id,
            },
          });
          if (!photo) {
            return {
              ok: false,
              error: "Photo not found",
            };
          }
          const likeWhere = {
            photoId_userId: {
              userId: loggedUser.id,
              photoId: id,
            },
          };
          const like = await client.like.findUnique({
            where: likeWhere,
          });
          if (like) {
            await client.like.delete({
              where: likeWhere,
            });
          } else {
            await client.like.create({
              data: {
                user: {
                  connect: {
                    id: loggedUser.id,
                  },
                },
                photo: {
                  connect: {
                    id: photo.id,
                  },
                },
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
