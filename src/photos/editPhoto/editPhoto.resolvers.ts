import { Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

type EditPhotoArgs = {
  id: number;
  caption: string;
};

type EditPhotoResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (
        _,
        { id, caption }: EditPhotoArgs,
        { loggedUser: { id: userId }, client }
      ): Promise<EditPhotoResult> => {
        try {
          const oldPhoto = await client.photo.findFirst({
            where: {
              id,
              userId,
            },
            include: {
              hashtags: {
                select: {
                  hashtag: true,
                },
              },
            },
          });
          if (!oldPhoto) {
            return {
              ok: false,
              error: "Photo not found",
            };
          }
          await client.photo.update({
            where: {
              id,
            },
            data: {
              caption,
              hashtags: {
                disconnect: oldPhoto.hashtags,
                connectOrCreate: processHashtags(caption),
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
