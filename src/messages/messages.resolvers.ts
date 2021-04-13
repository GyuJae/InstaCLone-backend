import { Resolvers } from "../type";

const resolvers: Resolvers = {
  Room: {
    user: ({ id }, _, { client }) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id: roomId }, _, { client }) =>
      client.message.findMany({
        where: {
          roomId,
        },
      }),
    unreadTotal: ({ id: roomId }, _, { client, loggedUser }) => {
      if (!loggedUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId,
          user: {
            id: {
              not: loggedUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }, _, { client }) =>
      client.message.findUnique({ where: { id } }).user(),
  },
};

export default resolvers;
