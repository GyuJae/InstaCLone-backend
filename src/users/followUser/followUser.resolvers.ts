import { Resolvers } from "../../type";
import { protectedResolver } from "../users.utils";

type FollowUserArgs = {
  username: string;
};

type FollowUserResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (
        _,
        { username }: FollowUserArgs,
        { loggedUser, client }
      ): Promise<FollowUserResult> => {
        try {
          const ok = await client.user.findUnique({
            where: {
              username,
            },
          });
          if (!ok) {
            return {
              ok: false,
              error: "That User does not exist",
            };
          }
          await client.user.update({
            where: {
              id: loggedUser.id,
            },
            data: {
              followings: {
                connect: {
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
