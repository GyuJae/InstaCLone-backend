import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { Resolvers } from "../../type";
import { FileUpload } from "graphql-upload";
import { uploadToS3 } from "../../shared/shared.utils";

type UpdateProfileArgs = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: FileUpload;
};

type UpdateProfileResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    updateProfile: protectedResolver(
      async (
        _,
        updateProfileArgs: UpdateProfileArgs,
        { loggedUser, client }
      ): Promise<UpdateProfileResult> => {
        try {
          const { password: newPassword, avatar } = updateProfileArgs;
          let avatarUrl = null;
          if (avatar) {
            avatarUrl = await uploadToS3(avatar, loggedUser.id, "avatars");
            /* const { filename, createReadStream } = await avatar;
            const newFilename = `${loggedUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + "/uploads/" + newFilename
            );
            readStream.pipe(writeStream);
            avatarUrl = `http://localhost:4000/static/${newFilename}`; */
          }
          let uglyPassword = null;
          if (newPassword) {
            uglyPassword = bcrypt.hash(newPassword, 10);
          }
          const updatedUser = await client.user.update({
            where: {
              id: loggedUser.id,
            },
            data: {
              ...updateProfileArgs,
              ...(uglyPassword && { password: uglyPassword }),
              avatar: avatarUrl,
            },
          });
          if (updatedUser.id) {
            return {
              ok: true,
            };
          }
          return {
            ok: false,
            error: "Could not update profile",
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
