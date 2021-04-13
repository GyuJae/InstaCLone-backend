import { protectedResolver } from "../users.utils";
import { Resolvers, User } from "../../type";

type SeeFollowingArgs = {
  username: string;
  lastId?: number;
};

type SeeFollowingResult = {
  ok: boolean;
  error?: string;
  following?: User[];
};

const resolvers: Resolvers = {
  Query: {
    seeFollowing: protectedResolver(
      async (
        _,
        { username, lastId }: SeeFollowingArgs,
        { client }
      ): Promise<SeeFollowingResult> => {
        try {
          const ok = await client.user.findUnique({
            where: { username },
            select: { id: true },
          });
          if (!ok) {
            return {
              ok: false,
              error: "Cannot find user",
            };
          }
          const following = await client.user
            .findUnique({ where: { username } })
            .followings({
              take: 5,
              skip: lastId ? 1 : 0,
              ...(lastId && { cursor: { id: lastId } }),
            });

          return {
            ok: true,
            following,
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
