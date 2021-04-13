import { Resolvers } from "../../type";

const resolvers: Resolvers = {
  Query: {
    seeRooms: (_, __, { client, loggedUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedUser.id,
            },
          },
        },
      }),
  },
};

export default resolvers;
