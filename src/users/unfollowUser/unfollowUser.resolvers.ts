import { protectedResolver } from "../users.utils";
import { Resolvers } from "../../type";

type UnfollowUserArgs = {
  username: string;
};

type UnfollowUserResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (
        _,
        { username }: UnfollowUserArgs,
        { loggedUser: { id }, client }
      ): Promise<UnfollowUserResult> => {
        try {
          const ok = await client.user.findUnique({
            where: {
              username,
            },
          });
          if (!ok) {
            return {
              ok: false,
              error: "Cannot unfollow user",
            };
          }
          await client.user.update({
            where: {
              id,
            },
            data: {
              followings: {
                disconnect: {
                  username,
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
