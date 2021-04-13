import { Resolvers, CoreOutputType } from "../../type";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { client, loggedUser }): Promise<CoreOutputType> => {
        try {
          const photo = await client.photo.findUnique({
            where: {
              id,
            },
            select: {
              userId: true,
            },
          });
          if (!photo) {
            return {
              ok: false,
              error: "Photo not found",
            };
          } else if (photo.userId !== loggedUser.id) {
            return {
              ok: false,
              error: "Not authorized",
            };
          } else {
            await client.photo.delete({
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
