import { Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver((_, __, { loggedUser: { id }, client }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id,
                  },
                },
              },
            },
            {
              userId: id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};

export default resolvers;
