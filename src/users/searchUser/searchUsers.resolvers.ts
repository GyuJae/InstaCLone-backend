import { Resolvers, User } from "../../type";

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword }, { client }): Promise<User[]> =>
      client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      }),
  },
};

export default resolvers;
