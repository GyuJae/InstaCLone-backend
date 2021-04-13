import { Resolvers, User } from "../../type";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectedResolver(
      (_, { username }, { client }): Promise<User> =>
        client.user.findUnique({
          where: {
            username,
          },
          include: {
            followings: true,
            followers: true,
          },
        })
    ),
  },
};

export default resolvers;
