import { uploadToS3 } from "../../shared/shared.utils";
import { Photo, Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

type UploadPhotoArgs = {
  file: string;
  caption?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }: UploadPhotoArgs, { loggedUser, client }) => {
        let hashtagsObj = [];
        if (caption) {
          hashtagsObj = processHashtags(caption);
        }
        const fileUrl = await uploadToS3(file, loggedUser.id, "uploads");
        return client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loggedUser.id,
              },
            },
            ...(hashtagsObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagsObj,
              },
            }),
          },
        });
      }
    ),
  },
};

export default resolvers;
