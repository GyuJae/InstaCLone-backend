import { Resolvers } from "../../type";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver((_, { id }, { loggedUser, client }) =>
      client.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: loggedUser.id,
            },
          },
        },
      })
    ),
  },
};

export default resolvers;
