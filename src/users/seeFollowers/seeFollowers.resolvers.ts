import { protectedResolver } from "../users.utils";
import { Resolvers, User } from "../../type";

type SeeFollowersArgs = {
  username: string;
  page: number;
};

type SeeFollowersResult = {
  ok: boolean;
  error?: string;
  followers?: User[];
  totalPages?: number;
};

const resolvers: Resolvers = {
  Query: {
    seeFollowers: protectedResolver(
      async (
        _,
        { username, page }: SeeFollowersArgs,
        { client }
      ): Promise<SeeFollowersResult> => {
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
          const followers = await client.user
            .findUnique({ where: { username } })
            .followers({ take: 5, skip: (page - 1) * 5 });
          const totalFollowers = await client.user.count({
            where: { followings: { some: { username } } },
          });
          return {
            ok: true,
            followers,
            totalPages: Math.ceil(totalFollowers / 5),
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
